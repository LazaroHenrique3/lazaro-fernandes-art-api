import * as count from './Count'
import * as create from './Create'
import * as getAll from './GetAll'
import * as generatePDF from './GeneratePDF'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as deleteById from './DeleteById' 

export const DimensionProvider = {
    ...count,
    ...create,
    ...getAll,
    ...generatePDF,
    ...getById,
    ...updateById,
    ...deleteById
}