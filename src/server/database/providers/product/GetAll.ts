import { ETableNames } from '../../ETablesNames'
import { IProduct } from '../../models'
import { Knex } from '../../knex'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<IProduct[] | Error> => {
    try {
        let result = await Knex(ETableNames.product)
            .select('id', 'status', 'status_of_sale', 'technique_id', 'category_id', 'title', 'orientation', 'main_image', 'type', 'quantity', 'production_date', 'description', 'weight', 'price')
            .where('id', Number(id))
            .orWhere('title', 'like', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && result.every(item => item.id !== id)) {
            const resultById = await Knex(ETableNames.product)
                .select('id', 'status', 'status_of_sale', 'technique_id', 'category_id', 'title', 'orientation', 'main_image', 'type', 'quantity', 'production_date', 'description', 'weight', 'price')
                .where('id', '*', id)
                .first()

            if (resultById) {
                result = [...result, resultById]
            }
        }

        //Formatando a resposta com o id das dimensões e imagens que cada produto possui
        if (result) {
            const formattedResult = await Promise.all(
                result.map(async (product) => {
                    const dimensions = await Knex(ETableNames.productDimensions)
                        .select('dimension_id')
                        .where('product_id', product.id)

                    const images = await Knex(ETableNames.productImages)
                        .select('name_image')
                        .where('product_id', product.id)

                    return {
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
                        dimensions: dimensions.map((dimension) => dimension.dimension_id),
                        product_images: images.map((image) => image.name_image)
                    }
                })
            )

            return formattedResult
        }

        return new Error('Erro ao consultar registros!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
}