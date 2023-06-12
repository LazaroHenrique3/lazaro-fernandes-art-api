import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IProduct } from '../../models'

import { UploadImages } from '../../../shared/services/UploadImagesServices'


export const create = async (product: Omit<IProduct, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se as dimensões passadas são válidas
        const { dimensions, product_images } = product

        //convertendo para um array numérico, e verificando se são válidas
        const dimensionNumberArray = dimensions.map(Number)

        const [{ count }] = await Knex(ETableNames.dimension).whereIn('id', dimensionNumberArray).count<[{ count: number }]>('* as count')
        
        if (count !== dimensions.length) {
            return new Error('Dimensões inválidas!')
        }

        //Formatando a data de produção
        const formattedProductionDate = new Date(product.production_date).toISOString().split('T')[0]

        //Product com todas as propriedades, para fazer o insert eu devo remover algumas delas
        const productWithAllProps = {
            ...product,
            production_date: formattedProductionDate
        }

        //Inserindo as imagens
        try {
            //Inserindo a imagem principal do produto
            productWithAllProps.main_image = await UploadImages.uploadImage(product.main_image[0], 'products')

            //Inserindo as demais imagens/criando um array de promisses
            const promises = productWithAllProps.product_images.map(async (image) => {
                return UploadImages.uploadImage(image, 'products')
            })

            //Aguardar a conclusão de todas as Promises e obter um array com os nomes das imagens
            productWithAllProps.product_images = await Promise.all(promises)
        } catch (error) {
            return new Error('Erro ao inserir imagem!')
        }

        //Transaction, para garantir que tanto a inserção das images, dimensões e do produto em si foram bem sucedidas.
        const result = await Knex.transaction(async (trx) => {
            //Pegando as props que preciso para o insert de product
            const { dimensions, product_images, ...insertProductData } = productWithAllProps

            //Cadastrando o produto
            const [productId] = await trx(ETableNames.product).insert(insertProductData).returning('id')

            //Formatando de acordo como o tipo de retorno
            const productIdFormatted = (typeof productId === 'number') ? productId : productId.id

            //Preparando o objeto de dimensões
            const dimensionsData = dimensions.map((dimensionId) => ({
                product_id: productIdFormatted,
                dimension_id: dimensionId
            }))

            //armazenando a relação de dimensões no banco
            await trx(ETableNames.productDimensions).insert(dimensionsData)

            //Preparando o objeto de imagens
            const imagesData = product_images.map((image) => ({
                product_id: productIdFormatted,
                name_image: image
            }))

            //Armazenando a relação de imagens e o produto
            await trx(ETableNames.productImages).insert(imagesData)

            return productId
        })


        //Se tudo correu bem ele deve estar com o id do novo produto
        if (typeof result === 'number') {
            return result
        } else if (typeof result === 'object') {
            return result.id
        }

        return new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}


