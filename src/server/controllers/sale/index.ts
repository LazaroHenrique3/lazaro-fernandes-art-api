import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as cancelSale from './CancelSale'
import * as paySale from './PaySale'

export const SaleController = {
    ...create,
    ...getAll,
    ...getById,
    ...cancelSale,
    ...paySale
}