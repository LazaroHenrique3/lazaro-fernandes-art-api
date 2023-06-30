import { IProduct } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IProduct[] | Error> => {

    try {
        let resultSearchFilter = await ProductUtil.getProductsWithFilter(filter, page, limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && resultSearchFilter.every(item => item.id !== id)) {
            const resultById = await ProductUtil.getProductById(id)

            if (resultById) {
                resultSearchFilter = [...resultSearchFilter, resultById]
            }
        }

        //Formatando a resposta com o id das dimensões e imagens que cada produto possui
        if (resultSearchFilter) {
            return await ProductUtil.formatAllResultsForResponse(resultSearchFilter)
        }

        return []
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
    
}




