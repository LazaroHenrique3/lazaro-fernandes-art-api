import { IProductUpdate } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { ProductUtil } from './util'

export const updateById = async (idProduct: number, product: Omit<IProductUpdate, 'id'>): Promise<void | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsProduct = await ProductUtil.checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }
        
        //Verificando se as dimensões passadas são válidas
        const validDimensions = await ProductUtil.checkValidDimensions(product.dimensions.map(Number))
        if (!validDimensions) {
            return new Error('Dimensões inválidas!')
        }

        //Formatando o objeto que será usado na inserção
        const productWithAllProps = ProductUtil.formatProductForUpdate(product)

        //Fluxo de alteração dos dados
        const {dimensions, ...productData} = productWithAllProps

        const result = await Knex.transaction(async (trx) => {
            await ProductUtil.updateProductInDatabase(idProduct, productData, trx)
            await ProductUtil.deleteRelationOfProductDimensionsInDatabase(idProduct, trx)
            await ProductUtil.insertProductDimensionsInDatabase(idProduct, dimensions.map(Number), trx)
        })

        if (result === undefined) {
            return
        } 

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}

