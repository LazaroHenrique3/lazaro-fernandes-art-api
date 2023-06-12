import { IAddress, 
    IAdministrator, 
    IAdministratorRoleAccess, 
    ICategory, 
    ICustomer, 
    IDimension, 
    IRoleAccess, 
    ITechnique, 
    IProduct,
    IProductDimensions,
    IProductImages} from '../../models'

//Tipando o knex
declare module 'knex/types/tables' {
    interface Tables {
        category: ICategory
        technique: ITechnique
        roleAccess: IRoleAccess
        administrator: IAdministrator
        administratorRoleAccess: IAdministratorRoleAccess
        address: IAddress
        customer: ICustomer
        dimension: IDimension
        productDimensions: IProductDimensions
        productImages: IProductImages
        product: IProduct
    }
}