import * as signIn from './SignIn'
import * as create from './Create'
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as updateImageById from './UpdateImageById'
import * as deleteById from './DeleteById' 
import * as deleteImageById from './DeleteImageById' 
import * as forgotPassword from './ForgotPassword'
import * as redefinePassword from './RedefinePassword'


export const CustomerController = {
    ...signIn,
    ...create,
    ...getAll,
    ...getById,
    ...updateById,
    ...updateImageById,
    ...deleteById,
    ...deleteImageById,
    ...forgotPassword,
    ...redefinePassword
}