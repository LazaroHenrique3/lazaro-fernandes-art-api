import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as deleteById from './DeleteById' 
import * as report from './Report'

export const CategoryController = {
    ...create,
    ...getAll,
    ...getById,
    ...updateById,
    ...deleteById,
    ...report
}