import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as inserImage from './InsertImage'
import * as updateImageById from './UpdateImageById'
import * as updateMainImageById from './UpdateMainImageById'
import * as deleteById from './DeleteById' 
import * as deleteImageById from './DeleteImageById' 
import * as report from './Report'


export const ProductController = {
    ...create,
    ...getAll,
    ...getById,
    ...updateById,
    ...inserImage,
    ...updateImageById,
    ...updateMainImageById,
    ...deleteById,
    ...deleteImageById,
    ...report
}