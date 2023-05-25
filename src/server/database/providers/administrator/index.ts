import * as count from './Count'
import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as getByEmail from './GetByEmail'
import * as updateById from './UpdateById'
import * as deleteById from './DeleteById' 

export const AdministratorProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...getByEmail,
    ...updateById,
    ...deleteById
}