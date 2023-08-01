import { IAddress, 
    IAdministrator, 
    ICategory, 
    ICustomer, 
    IDimension, 
    ITechnique, 
    IProduct,
    IProductImages,
    ISale,
    ISalesItems
} from '../../models'

//Tipando o knex
declare module 'knex/types/tables' {
    interface Tables {
        category: ICategory
        technique: ITechnique
        administrator: IAdministrator
        address: IAddress
        customer: ICustomer
        dimension: IDimension
        productImages: IProductImages
        product: IProduct
        sale: ISale
        salesItems: ISalesItems
    }
}