//Funções auxiliares
import { IPriceDeadlineResponse } from '../../../shared/services'
import { IDimension, IProduct, IProductCart } from '../../models'
import { DimensionUtil } from '../dimension/util'
import { ProductUtil } from '../product/util'
import { SaleUtil } from './util'
import { calculateNewShippingValue, getLargestLength, getLargestWidth, getTotalHeight, getTotalWeightInKilograms } from './util/formatFunctions'

export const recalculateShippingValueSale = async (idCustomer: number, idSale: number, cep: string): Promise<IPriceDeadlineResponse | Error | undefined> => {

    try {
        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento', 'Em preparação', 'Enviado', 'Concluída'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        //Buscando informações dos produtos da venda
        const saleItems = await SaleUtil.getSaleItemsById(idSale)

        if (saleItems) {
            const saleItemsProductPromises = saleItems.map(async (item) => ProductUtil.getProductById(item.product_id))
            // Usando Promise.all para aguardar a resolução de todas as promessas
            const saleItemsProductResolved = await Promise.all(saleItemsProductPromises)
            // Filtrar elementos indefinidos
            const saleItemsProduct = saleItemsProductResolved.filter((product) => product !== undefined) as IProduct[]

            const saleItemsProductDimensionsPromises = saleItemsProduct.map(async (item) => DimensionUtil.getDimensionById(item.dimension_id))
            // Usando Promise.all para aguardar a resolução de todas as promessas
            const saleItemsProductDimensionsResolved = await Promise.all(saleItemsProductDimensionsPromises)
            // Filtrar elementos indefinidos
            const saleItemsProductDimensions = saleItemsProductDimensionsResolved.filter((dimension) => dimension !== undefined) as IDimension[]

            const saleItemsProductCart: IProductCart[] = saleItemsProduct.map((product, index) => {
                return {
                    id: product.id,
                    price: saleItems[index].price,
                    weight: product.weight,
                    dimension: saleItemsProductDimensions[index].dimension,
                    quantitySelected: saleItems[index].quantity,
                }
            })

            const formattedSaleItemsProductCart = {
                cep: cep,
                weight: getTotalWeightInKilograms(saleItemsProductCart),
                width: getLargestWidth(saleItemsProductCart),
                length: getLargestLength(saleItemsProductCart),
                height: getTotalHeight(saleItemsProductCart),
            }

            try {
                const newShippingValue = await calculateNewShippingValue(formattedSaleItemsProductCart)

                if (newShippingValue instanceof Error) {
                    return new Error('Erro ao atualizar endereço!')
                }

                return newShippingValue

            } catch (error) {
                return new Error('Erro ao atualizar endereço!')
            }
        }

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar endereço!')
    }

}


