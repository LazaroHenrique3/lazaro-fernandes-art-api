import { IProduct } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAllAdmin = async (
    page: number, 
    limit: number, 
    filter: string, 
    status: string,
    type: string,
    orientation: string,
    category: string,
    technique: string,
    dimension: string,
    productionDate: string,
    orderByPrice: string,
    id = 0
): Promise<IProduct[] | Error> => {

    try {
        let resultSearchFilter = await ProductUtil.getAdminProductsWithFilter(filter, page, limit, status, type, orientation, category, technique, dimension, productionDate, orderByPrice)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && resultSearchFilter.every(item => item.id !== id)) {
            const resultById = await ProductUtil.getProductById(id)

            if (resultById) {
                resultSearchFilter = [...resultSearchFilter, resultById]
            }
        }

        //Formatando a resposta com o nome das imagensi
        if (resultSearchFilter) {
            return await ProductUtil.formatAllResultsForResponse(resultSearchFilter)
        }

        return []
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
    
}




