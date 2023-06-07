import { IAddress, IAdministrator, ICategory, ICustomer, IDimension, IRoleAccess, ITechnique } from '../../models'
import { IAdministratorRoleAccess } from '../../models/Administrator_role_access'

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
    }
}