import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as cancelSale from './CancelSale'
import * as paySale from './PaySale'
import * as sendSale from './SendSale'
import * as concludeSale from './ConcludeSale'
import * as deleteById from './DeleteById'

export const SaleController = {
    ...create,
    ...getAll,
    ...getById,
    ...cancelSale,
    ...paySale,
    ...sendSale,
    ...concludeSale,
    ...deleteById
}