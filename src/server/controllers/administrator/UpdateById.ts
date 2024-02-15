import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

import { validation } from '../../shared/middleware'
import { IAdministratorUpdate } from '../../database/models'
import { AdministratorProvider } from '../../database/providers/administrator'


interface IParamProps {
    id?: number;
}

interface IBodyProps extends Omit<IAdministratorUpdate, 'id' | 'admin_access_level'> { }

//Midleware
export const updateByIdValidation = validation(getSchema => ({
    body: getSchema<IBodyProps>(yup.object().shape({
        status: yup.string().oneOf(['Ativo', 'Inativo']).default('Ativo').required(),
        name: yup.string().required().min(3).max(100),
        email: yup.string().email().min(5).max(100).matches(/^[\w!#$%&'*+/=?`{|}~.-]+@([\w-]+\.)+[\w-]{2,4}$/, 'Ex: exemplo@dominio.com').required(),
        password: yup.string().optional().min(6),
        confirmPassword: yup.string().test({
            name: 'password-match',
            test: function (value) {
                const { password } = this.parent
                if (password) {
                    return value === password
                }
                return true
            },
            message: 'As senhas devem ser iguais',
        }).default('nopassword'),
    })),
    params: getSchema<IParamProps>(yup.object().shape({
        id: yup.number().integer().required().moreThan(0),
    }))
}))

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
    if (!req.params.id) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errors: {
                default: 'O parâmetro "id" precisa ser informado.'
            }
        })
    }

    let accessLevel = 'Admin'
    //Siginifica que é o próprioa admin root que está solicitando
    if(req.headers.accessLevel === 'Root' && Number(req.headers.idUser) === Number(req.params.id)){
        accessLevel = 'Root'
    }

    const result = await AdministratorProvider.updateById(req.params.id, {...req.body, admin_access_level: accessLevel})
    if (result instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: {
                default: result.message
            }
        })
    }

    return res.status(StatusCodes.NO_CONTENT).send(result)
}