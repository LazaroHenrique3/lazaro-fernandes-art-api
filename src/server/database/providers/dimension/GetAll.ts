import { IDimension } from '../../models'

//Funções auxiliares
import { DimensionUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id: number[]): Promise<IDimension[] | Error> => {

    try {
        let resultSearchFilter = await DimensionUtil.getDimensionsWithFilter(filter, page, limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id.length > 0 && id.some(idItem => !resultSearchFilter.some(item => item.id === idItem))) {
            // Filtra os IDs que ainda não estão no resultSearchFilter
            const missingIds = id.filter(idItem => !resultSearchFilter.some(item => item.id === idItem))

            // Faz as chamadas assíncronas apenas para os IDs que estão faltando
            const resultByIds: IDimension[] = []
            await Promise.all(missingIds.map(async (itemId) => {
                const result = await DimensionUtil.getDimensionById(itemId)
                if (result) {
                    resultByIds.push(result)
                }
            }))

            // Adiciona os resultados ao resultSearchFilter
            if (resultByIds) {
                resultSearchFilter = [...resultSearchFilter, ...resultByIds]
            }
        }

        return resultSearchFilter

    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }

}