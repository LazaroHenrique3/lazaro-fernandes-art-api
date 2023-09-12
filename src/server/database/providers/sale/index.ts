import * as create from './Create'
import * as count from './Count'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as cancelSale from './CancelSale'

export const SaleProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...cancelSale
}