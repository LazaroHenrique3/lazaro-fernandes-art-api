import { IProductUpdate } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { ProductUtil } from './util'

export const updateById = async (idProduct: number, product: Omit<IProductUpdate, 'id'>, accessLevel: string): Promise<void | Error> => {
    try {
        //Só quem pode atualizar o status e tipo do produto é o 'Admin'
        const wasChanged = await ProductUtil.checkIfThereHasBeenChangeInStatusAndType(idProduct, product.status, product.type)
        if(wasChanged && accessLevel === 'Root'){
            return new Error('Não tem permissão para este tipo de alteração!')
        }

        //Verificando se a Categoria, Technica e Dimensão enviada esta ativa
        const isValid = await ProductUtil.checkValidCategoryTechniqueAndDimension(product.category_id, product.technique_id, product.dimension_id)
        if (isValid instanceof Error) {
            return new Error(isValid.message)
        }

        //Verificando se o id informado é valido
        const existsProduct = await ProductUtil.checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Formatando o objeto que será usado na inserção
        const productWithAllProps = ProductUtil.formatProductForUpdate(product)

        //Fluxo de alteração dos dados
        const result = await Knex.transaction(async (trx) => {
            await ProductUtil.updateProductInDatabase(idProduct, productWithAllProps, trx)
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

