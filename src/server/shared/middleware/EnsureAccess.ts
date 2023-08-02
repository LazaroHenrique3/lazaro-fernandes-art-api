import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

type UserType = 'admin' | 'customer';

export const ensureAccess = (typeUser: UserType[], isRootAccess?: boolean): RequestHandler => {
    return async (req, res, next) => {

        //Recebendo qual o tipo do user
        const typeUserReq = req.headers.typeUser
        //Recebendo o id do user da request
        const userId = req.headers.idUser
        //Recebendo o id do param, caso ele exista
        const paramId = (req.params.id) ? req.params.id : null
        //Recebendo o nivel de acesso
        const accessLevel = (req.headers.accessLevel)

        //Verificando se ele esta entre os tipos de usuario permitidos de acordo com os parametros parametro
        if (typeof typeUserReq === 'string' && !typeUser.includes(typeUserReq as UserType)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                errors: {
                    default: 'Acesso restrito!'
                }
            })
        }

        if (typeUserReq === 'admin' && paramId !== null && isRootAccess) {
            //Se tiver restrição root, significa que se o uduario não for root ele só pode fazer alterações em cosias que diz respeito ao seu id
            if (accessLevel !== 'Root' && userId !== paramId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    errors: {
                        default: 'Ação não permitida!'
                    }
                })
            }
        }

        if (typeUserReq === 'customer' && paramId !== null) {
            //Se ele for cliente devo assegurar que ele faça somente ações que dizem respeito a si memso(id)
            if (userId !== paramId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    errors: {
                        default: 'Ação não permitida!'
                    }
                })
            }
        }

        next()
    }
}
