import * as count from './Count'
import * as create from './Create'
import * as insertImage from './InsertImage'
import * as getAll from './GetAll'
import * as generatePDF from './GeneratePDF'
import * as getById from './GetById'
import * as getByEmail from './GetByEmail'
import * as updateById from './UpdateById'
import * as updateImageById from './UpdateImageById'
import * as deleteById from './DeleteById' 
import * as deleteImageById from './DeleteImageById'
import * as forgotPassword  from './ForgotPassword'
import * as redefinePassword from './RedefinePassword'

export const CustomerProvider = {
    ...count,
    ...create,
    ...insertImage,
    ...getAll,
    ...generatePDF,
    ...getById,
    ...getByEmail,
    ...updateById,
    ...updateImageById,
    ...deleteById,
    ...deleteImageById,
    ...forgotPassword,
    ...redefinePassword
}