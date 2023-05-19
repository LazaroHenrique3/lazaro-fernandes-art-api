import { ICategory } from '../../models'

//Tipando o knex
declare module 'knex/types/tables' {
    interface Tables {
        category: ICategory
    }
}