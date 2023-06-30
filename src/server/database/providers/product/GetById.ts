import { IProduct } from '../../models'

//Funções auxiliares
import { ProductUtil } from './util'

export const getById = async (idProduct: number): Promise<IProduct | Error> => {

    try {
        //Verificando se o id informado é valido
        const existsProduct = await ProductUtil.checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }

        //Buscando o produto
        const product = await ProductUtil.getProductById(idProduct)

        //Retornando o objeto de produtos devidamente formatado
        if (product) {
            return await ProductUtil.formatResultByIdForResponse(product, idProduct)
        }

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}





