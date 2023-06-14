import { ETableNames } from '../../ETablesNames'
import { IProduct } from '../../models'
import { Knex } from '../../knex'

export const getById = async (idProduct: number): Promise<IProduct | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsProduct = await checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Buscando o produto
        const product = await getProductById(idProduct)
        
        //Formatando a resposta com o id das dimensões e imagens do produto
        if (product) {
            //Buscando as dimensoes do produto
            const dimensions = await getProductDimensionsById(idProduct)
            //Buscando as imagens do produto
            const images = await getProductImagesById(idProduct)

            const formattedResult: IProduct = {
                id: product.id,
                status: product.status,
                status_of_sale: product.status_of_sale,
                technique_id: product.technique_id,
                category_id: product.category_id,
                title: product.title,
                orientation: product.orientation,
                main_image: product.main_image,
                type: product.type,
                quantity: product.quantity,
                production_date: product.production_date,
                description: product.description,
                weight: product.weight,
                price: product.price,
                dimensions,
                product_images: images,
            }

            return formattedResult
        }

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}

//Funções auxiliares
//--Faz a checagem se o id passado é valido e já impede o prcessamento desnecessário
const checkValidProductId = async (idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    return productResult !== undefined
}

//--Busca o produto no banco de dados
const getProductById = async (id: number): Promise<IProduct | undefined> => {
    return Knex(ETableNames.product)
        .select('*')
        .where('id', '=', id)
        .first()
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