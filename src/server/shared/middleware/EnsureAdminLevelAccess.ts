import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export const ensureAdminLevelAccess = (permissions: number[]): RequestHandler => {
    return async (req, res, next) => {

        //Assegurar que apenas admins tenham acesso
        const typeUser = req.headers.typeUser

        if(typeUser !== 'admin'){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                errors: {
                    default: 'Acesso restrito a administradores!'
                }
            })
        }

        //Assegurar o match entre o nivel de acesso requerido
        let userPermissions: number[] = []

        //Convertendo de volta a um array de numeros
        if(req.headers.permissionsUser && Array.isArray(req.headers.permissionsUser)){
            userPermissions = req.headers.permissionsUser.map(Number)
        }

        if(!checkIfAnyValueMatches(permissions, userPermissions)){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                errors: {
                    default: 'Você não possui o nível de acesso necessário!'
                }
            })
        }

        next()
    }
}

function checkIfAnyValueMatches(permissions: number[], userPermissions: number[]): boolean {
    return permissions.some((permission) => userPermissions.includes(permission))
}