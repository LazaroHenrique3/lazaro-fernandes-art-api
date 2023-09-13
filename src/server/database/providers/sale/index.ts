import * as create from './Create'
import * as count from './Count'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as deleteById from './DeleteById'
import * as cancelSale from './CancelSale'
import * as paySale from './PaySale'
import * as sendSale from './SendSale'
import * as concludeSale from './ConcludeSale'

export const SaleProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...deleteById,
    ...cancelSale,
    ...paySale,
    ...sendSale,
    ...concludeSale
}