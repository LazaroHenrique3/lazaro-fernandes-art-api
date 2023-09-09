import * as create from './Create'
import * as count from './Count'
import * as getAll from './GetAll'

export const SaleProvider = {
    ...count,
    ...create,
    ...getAll
}