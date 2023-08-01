import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export const ensureAccess = (typeUser: string[]): RequestHandler => {
    return async (req, res, next) => {

        //Recebendo qual o tipo do user
        const typeUserReq = req.headers.typeUser
        //Recebendo o id do user da request
        const userId = req.headers.idUser
        //Recebendo o id do param, caso ele exista
        const paramId = (req.params.id) ? req.params.id : null

        //Verificando se ele esta entre os tipos de usuario permitidos de acordo com os parametros parametro
        if (typeof typeUserReq === 'string' && !typeUser.includes(typeUserReq)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                errors: {
                    default: 'Acesso restrito!'
                }
            })
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
