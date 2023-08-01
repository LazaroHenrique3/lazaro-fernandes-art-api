import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAdministrator } from '../../database/models'
import { AdministratorProvider } from '../../database/providers/administrator'
import { PasswordCrypto } from '../../shared/services'
import { JWTServices } from '../../shared/services/JWTServices'

//Para tipar o body do request
interface IBodyProps extends Omit<IAdministrator, 'id' | 'status' | 'name'> { }

//Midleware
export const signInValidation = validation((getSchema) => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        email: yup.string().required().email().min(5).max(100),
        password: yup.string().required().min(6).max(256),
    }))
}))

export const signIn = async (req: Request<{}, {}, IBodyProps>, res: Response) => {

    const { email, password } = req.body

    //Verificando se existe o administrador pelo email
    const administrator = await AdministratorProvider.getByEmail(email)

    if (administrator instanceof Error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email e/ou senha inválido(s)!'
            }
        })
    }

    //Verificando a senha
    const passwordMatch = await PasswordCrypto.verifyPassword(password, administrator.password)

    if (!passwordMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            errors: {
                default: 'Email e/ou senha inválido(s)!'
            }
        })
    } else {
        const accessToken = JWTServices.sign({uid: administrator.id, typeUser: 'admin'})
        if(accessToken === 'JWT_SECRET_NOT_FOUND') {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                errors: {
                    default: 'Erro ao gerar token de acesso!'
                }
            })
        }

        return res.status(StatusCodes.OK).json({ 
            name: administrator.name,
            typeUser: 'admin',
            accessToken: accessToken
        })
    }
}