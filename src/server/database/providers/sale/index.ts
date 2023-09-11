import * as create from './Create'
import * as count from './Count'
import * as getAll from './GetAll'
import * as getById from './GetById'

export const SaleProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById
}