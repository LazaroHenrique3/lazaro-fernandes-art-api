import * as create from './Create'
import * as getAll from './GetAll'
import * as getAllAdmin from './GetAllAdmin'
import * as getById from './GetById'
import * as cancelSale from './CancelSale'
import * as paySale from './PaySale'
import * as sendSale from './SendSale'
import * as updateTrackingCodeById from './UpdateTrackingCodeById'
import * as concludeSale from './ConcludeSale'
import * as deleteById from './DeleteById'
import * as getFinancialInformation from './GetFinancialInformation'
import * as report from './Report'

export const SaleController = {
    ...create,
    ...getAll,
    ...getAllAdmin,
    ...getById,
    ...cancelSale,
    ...paySale,
    ...sendSale,
    ...updateTrackingCodeById,
    ...concludeSale,
    ...deleteById,
    ...getFinancialInformation,
    ...report
}