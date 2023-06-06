import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export const ensureAccess = (typeUser: string[], permissions?: number[]): RequestHandler => {
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

        //Se ele for administrador, tenho que verificar ainda se ele tem nivel de acesso sulficiente para acessar
        if (typeUserReq === 'admin') {

            let userPermissions: number[] = []

            //Convertendo de volta a um array de numeros
            if (req.headers.permissionsUser && Array.isArray(req.headers.permissionsUser)) {
                userPermissions = req.headers.permissionsUser.map(Number)
            }

            if (permissions === undefined || userPermissions.length === 0) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    errors: {
                        default: 'Houve um erro ao verificar seu nivel de acesso!'
                    }
                })
            } else {
                //Verifica se tem o nivel de acesso necessário
                if (!checkIfAnyValueMatches(permissions, userPermissions)) {
                    return res.status(StatusCodes.UNAUTHORIZED).json({
                        errors: {
                            default: 'Você não possui o nível de acesso necessário!'
                        }
                    })
                }
            }
        } else if (typeUserReq === 'customer' && paramId !== null) {
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

function checkIfAnyValueMatches(permissions: number[], userPermissions: number[]): boolean {
    return permissions.some((permission) => userPermissions.includes(permission))
}