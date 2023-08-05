import * as count from './Count'
import * as create from './Create'
import * as getAll from './GetAll'
import * as generatePDF from './GeneratePDF'
import * as getById from './GetById'
import * as getByEmail from './GetByEmail'
import * as updateById from './UpdateById'
import * as deleteById from './DeleteById' 
import * as forgotPassword from './ForgotPassword'
import * as redefinePassword from './RedefinePassword'

export const AdministratorProvider = {
    ...count,
    ...create,
    ...getAll,
    ...generatePDF,
    ...getById,
    ...getByEmail,
    ...updateById,
    ...deleteById,
    ...forgotPassword,
    ...redefinePassword
}