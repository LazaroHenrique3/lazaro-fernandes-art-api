import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { ICustomerRedefinePassword } from '../../database/models'
import { CustomerProvider } from '../../database/providers/customer'

//Para tipar o body do request
interface IBodyProps extends Omit<ICustomerRedefinePassword, 'verification_token_expiration'> { }

//Midleware
export const redefinePasswordValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().email().min(5).max(100),
        verification_token: yup.string().length(6).required(),
        password: yup.string().required().min(6),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais').required()
    }))
}))

export const redefinePassword = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

    const result = await CustomerProvider.redefinePassword(req.body)
    if(result instanceof Error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)   
}
