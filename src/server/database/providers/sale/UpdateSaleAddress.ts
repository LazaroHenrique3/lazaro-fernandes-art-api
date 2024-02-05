//Funções auxiliares
import { 
    IDimension, 
    IProduct, 
    IProductCart, 
    IUpdatedSaleAddress 
} from '../../models'
import { AddressUtil } from '../address/util'
import { DimensionUtil } from '../dimension/util'
import { ProductUtil } from '../product/util'
import { SaleUtil } from './util'
import { 
    calculateEstimatedDeliveryTime, 
    calculateNewShippingValue, 
    getLargestLength, 
    getLargestWidth, 
    getTotalHeight, 
    getTotalWeightInKilograms, 
    replaceCommaWithDot 
} from './util/formatFunctions'

export const updateSaleAddress = async (idCustomer: number, idSale: number, idNewAddress: number, shippingMethod: 'PAC' | 'SEDEX', typeUser: string): Promise<IUpdatedSaleAddress | Error | undefined> => {

    try {
        //Verificando se o id de cliente informado é valido
        const existsCustomer = await SaleUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Usuário inválido!')
        }

        //Se o tipo do usuario que solicitar for customer, ele só pode alterar se estiver no status 'Ag. Pagamento'
        if (typeUser === 'customer') {
            //Verificando, ele só vai retornar como true se a venda estiver como 'Ag. Pagamento'
            const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento'])
            if (!existsSale) {
                return new Error('Contate o adminsitrador para cancelar essa venda!')
            }
        } else if (typeUser === 'admin' || typeUser === 'root') {
            //Porém se for admin, pode alterar também enquanto estiver com o status "Em preparação"
            const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento', 'Em preparação'])
            if (!existsSale) {
                return new Error('O endereço de entrega não pode mais ser alterado!')
            }
        }

        //Verificando se o id de venda informado é valido
        const existsSale = await SaleUtil.checkValidSaleId(idSale, idCustomer, ['Ag. Pagamento', 'Em preparação', 'Enviado', 'Concluída'])
        if (!existsSale) {
            return new Error('Id informado inválido!')
        }

        const existsAddress = await SaleUtil.checkValidAddressId(idNewAddress, idCustomer)
        if (!existsAddress) {
            return new Error('Endereço inválido!')
        }

        //Buscando informações dos produtos da venda
        const saleItems = await SaleUtil.getSaleItemsById(idSale)

        const newAddress = await AddressUtil.getAddressById(idNewAddress, idCustomer)

        if (saleItems && newAddress) {
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
                cep: newAddress.cep,
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

                //Calculando o valor subtotal do pedido
                const subtotal = saleItems.reduce((acc, productSale) => {
                    return acc + ((productSale.price * productSale.quantity) - productSale.discount)
                }, 0)

                const shippingMethodSelectedValue = (shippingMethod === 'PAC') ? newShippingValue.valorpac : newShippingValue.valorsedex
                const estimatedDeadline = (shippingMethod === 'PAC') ? newShippingValue.prazopac : newShippingValue.prazosedex

                //Calculando o tempo estimado de entrega
                const formattedDeadlinePac = calculateEstimatedDeliveryTime(estimatedDeadline)

                //Agora atualizar as informações no banco de dados
                const updatedAddress = await SaleUtil.updateSaleAddress(
                    idSale,
                    idCustomer,
                    idNewAddress,
                    formattedDeadlinePac,
                    shippingMethod,
                    Number(replaceCommaWithDot(shippingMethodSelectedValue)),
                    subtotal
                )

                if (updatedAddress instanceof Error) {
                    return new Error('Erro ao atualizar endereço!')
                }

                return updatedAddress

            } catch (error) {
                return new Error('Erro ao atualizar endereço!')
            }
        }

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar endereço!')
    }

}



