import * as signIn from './SignIn'
import * as create from './Create'
import * as insertImage from './InsertImage'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as updateImageById from './UpdateImageById'
import * as deleteById from './DeleteById' 
import * as deleteImageById from './DeleteImageById' 
import * as forgotPassword from './ForgotPassword'
import * as redefinePassword from './RedefinePassword'
import * as report from './Report'

export const CustomerController = {
    ...signIn,
    ...create,
    ...insertImage,
    ...getAll,
    ...getById,
    ...updateById,
    ...updateImageById,
    ...deleteById,
    ...deleteImageById,
    ...forgotPassword,
    ...redefinePassword,
    ...report
}