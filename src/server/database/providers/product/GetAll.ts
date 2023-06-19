import { ETableNames } from '../../ETablesNames'
import { IProduct } from '../../models'
import { Knex } from '../../knex'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IProduct[] | Error> => {
    try {
        let resultSearchFilter = await getProductsWithFilter(filter, page, limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && resultSearchFilter.every(item => item.id !== id)) {
            const resultById = await getProductById(id)

            if (resultById) {
                resultSearchFilter = [...resultSearchFilter, resultById]
            }
        }

        //Formatando a resposta com o id das dimensões e imagens que cada produto possui
        if (resultSearchFilter) {
            return await formatResultsForResponse(resultSearchFilter)
        }

        return new Error('Erro ao consultar registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
}

//Funções auxiliares
//Faz a busca utilizando o filtro de pesquisa
const getProductsWithFilter = async (filter: string, page: number, limit: number): Promise<IProduct[]> => {
    return Knex(ETableNames.product)
        .select('*')
        .where('title', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)
}

//Faz a busca utilizando algum id caso ele seja informado
const getProductById = async (id: number): Promise<IProduct | undefined> => {
    return Knex(ETableNames.product)
        .select('*')
        .where('id', '=', id)
        .first()
}

//--Faz a formatação do objeto que será devolvido para o cliente
const formatResultsForResponse = async (productList: IProduct[]): Promise<IProduct[]> => {
    return await Promise.all(
        productList.map(async (product) => {

            //Buscando as dimensoes do produto
            const dimensions = await getProductDimensionsById(product.id)
            //Buscando as imagens do produto
            const images = await getProductImagesById(product.id)

            return {
                ...product,
                dimensions: dimensions,
                product_images: images
            }
        })
    )
}

//--Busca as dimensões do produto no banco de dados
const getProductDimensionsById = async (id: number): Promise<number[]> => {
    const dimensions = await Knex(ETableNames.productDimensions)
        .select('dimension_id')
        .where('product_id', id)

    return dimensions.map((dimension) => dimension.dimension_id)
}

//--Busca as imagens do produto no banco de dados
const getProductImagesById = async (id: number): Promise<string[]> => {
    const images = await Knex(ETableNames.productImages)
        .select('name_image')
        .where('product_id', id)

    return images.map((image) => image.name_image)
}

