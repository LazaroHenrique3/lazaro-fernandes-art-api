import { ETableNames } from '../../ETablesNames'
import { IProduct } from '../../models'
import { Knex } from '../../knex'

export const getById = async (id: number): Promise<IProduct | Error> => {
    try {
        const result = await Knex(ETableNames.product).select('id', 'status', 'status_of_sale', 'technique_id', 'category_id', 'title', 'orientation', 'main_image', 'type', 'quantity', 'production_date', 'description', 'weight', 'price')
            .where('id', '=', id).first()

        //Formatando a resposta com o id das dimensões e imagens do produto
        if (result) {
            //Buscando as dimensões do produto
            const dimensions = await Knex(ETableNames.productDimensions)
                .select('dimension_id')
                .where('product_id', id)

            //Buscando as imagens do produto
            const images = await Knex(ETableNames.productImages)
                .select('name_image')
                .where('product_id', id)

            const formattedResult = {
                id: result.id,
                status: result.status,
                status_of_sale: result.status_of_sale,
                technique_id: result.technique_id,
                category_id: result.category_id,
                title: result.title,
                orientation: result.orientation,
                main_image: result.main_image,
                type: result.type,
                quantity: result.quantity,
                production_date: result.production_date,
                description: result.description,
                weight: result.weight,
                price: result.price,
                dimensions: dimensions.map((dimension) => dimension.product_id),
                product_images: images.map((image) => image.name_image)
            }

            return formattedResult
        }

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}