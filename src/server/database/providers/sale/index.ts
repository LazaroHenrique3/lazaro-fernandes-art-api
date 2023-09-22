import * as create from './Create'
import * as count from './Count'
import * as countAdmin from './CountAdmin'
import * as getAll from './GetAll'
import * as getAllAdmin from './GetAllAdmin'
import * as generatePDF from './GeneratePDF'
import * as getById from './GetById'
import * as deleteById from './DeleteById'
import * as cancelSale from './CancelSale'
import * as paySale from './PaySale'
import * as sendSale from './SendSale'
import * as concludeSale from './ConcludeSale'

export const SaleProvider = {
    ...count,
    ...countAdmin,
    ...create,
    ...getAll,
    ...getAllAdmin,
    ...generatePDF,
    ...getById,
    ...deleteById,
    ...cancelSale,
    ...paySale,
    ...sendSale,
    ...concludeSale
}