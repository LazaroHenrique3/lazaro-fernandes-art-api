import * as count from './Count'
import * as countAdmin from './CountAdmin'
import * as create from './Create'
import * as getAll from './GetAll'
import * as getAllAdmin from './GetAllAdmin'
import * as generatePDF from './GeneratePDF'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as insertImage from './InsertImage'
import * as updateImageById from './UpdateImageById'
import * as updateMainImageById  from './UpdateMainImageById'
import * as deleteById from './DeleteById' 
import * as deleteImageById from './DeleteImageById'

export const ProductProvider = {
    ...count,
    ...countAdmin,
    ...create,
    ...getAll,
    ...getAllAdmin,
    ...generatePDF,
    ...getById,
    ...updateById,
    ...insertImage,
    ...updateImageById,
    ...updateMainImageById,
    ...deleteById,
    ...deleteImageById
}