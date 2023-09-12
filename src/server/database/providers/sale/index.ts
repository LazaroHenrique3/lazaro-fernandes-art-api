import * as create from './Create'
import * as count from './Count'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as cancelSale from './CancelSale'
import * as paySale from './PaySale'
import * as sendSale from './SendSale'

export const SaleProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...cancelSale,
    ...paySale,
    ...sendSale
}