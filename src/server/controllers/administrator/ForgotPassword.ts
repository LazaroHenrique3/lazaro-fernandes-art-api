import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAdministrator } from '../../database/models'
import { AdministratorProvider } from '../../database/providers/administrator'

//Para tipar o body do request
interface IBodyProps extends Omit<IAdministrator, 'id' | 'status' | 'admin_access_level' | 'name' | 'password' |  'verification_token' | 'verification_token_expiration'> { }

//Midleware
export const forgotPasswordValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().email().min(5).max(100),
    }))
}))

export const forgotPassword = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

    const { email } = req.body

    const result = await AdministratorProvider.forgotPassword(email)
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.OK).send('Um token de verificação foi enviado ao seu email!')

   
}
