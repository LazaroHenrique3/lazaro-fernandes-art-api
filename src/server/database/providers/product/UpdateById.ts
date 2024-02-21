import { IProductUpdate } from '../../models'
import { Knex } from '../../knex'

//Funções auxiliares
import { ProductUtil } from './util'

export const updateById = async (idProduct: number, product: Omit<IProductUpdate, 'id'>, accessLevel: string): Promise<void | Error> => {
    try {
        //Só quem pode atualizar o status e tipo do produto é o 'Root'
        const wasChanged = await ProductUtil.checkIfThereHasBeenChangeInStatusAndType(idProduct, product.status, product.type)
        if (wasChanged && accessLevel !== 'Root') {
            return new Error('Não tem permissão para este tipo de alteração!')
        }

        //Se já estiver em mais de uma venda eu não posso alterar o tipo para Original, já que ele não pode ter mais de um no sistema
        if (wasChanged && product.type === 'Original') {
            const productIsInUse = await ProductUtil.checkProductSalesCount(idProduct)
            if (productIsInUse > 1) {
                return new Error('Este produto não pode ser Original pois já está vinculado a vendas!')
            }
        }

        //Não posso alterar para ativo se ele for Original e já estiver em alguma venda
        if(wasChanged && product.status === 'Ativo' && product.type === 'Original'){
            const productIsInUse = await ProductUtil.checkIfProductIsInUse(idProduct)
            if (productIsInUse) {
                return new Error('Este produto já foi vendido!')
            }    
        }

        //Não posso alterar para vendido se ele não estiver vinculado a nenhuma venda
        if (wasChanged && product.status === 'Vendido'){
            const productIsInUse = await ProductUtil.checkIfProductIsInUse(idProduct)
            if (!productIsInUse) {
                return new Error('Este produto não esta vinculado a nenhuma venda!')
            }    
        }

        //A quantidade deve ser zero caso o tipo for "Original" e já estiver vinculada a vendas
        if (product.type === 'Original' && product.quantity > 0){
            const productIsInUse = await ProductUtil.checkIfProductIsInUse(idProduct)
            if (productIsInUse) {
                return new Error('Este produto já foi vendido, a quantidade deve ser  0!')
            }    
        }

        //Verificando se a Categoria, Tecnica e Dimensão enviada esta ativa
        const isValid = await ProductUtil.checkValidCategoryTechniqueAndDimension(product.category_id, product.technique_id, product.dimension_id, true, idProduct)
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

