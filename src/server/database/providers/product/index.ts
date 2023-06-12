import * as count from './Count'
import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as getByEmail from './GetByEmail'
import * as updateById from './UpdateById'
import * as updateImageById from './UpdateImageById'
import * as deleteById from './DeleteById' 
import * as deleteImageById from './DeleteImageById'

export const ProductProvider = {
    ...count,
    ...create,
    ...getAll,
    ...getById,
    ...getByEmail,
    ...updateById,
    ...updateImageById,
    ...deleteById,
    ...deleteImageById
}