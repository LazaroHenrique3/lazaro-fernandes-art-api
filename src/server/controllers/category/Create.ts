import { Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as yup from 'yup'

//Para tipar o body do request
interface ICategory {
    name: string
}

const categoryValidation: yup.ObjectSchema<ICategory> = yup.object().shape({
    name: yup.string().required().min(3)
})

export const createBodyValidator:RequestHandler = async (req, res, next) => {
    try {
        await categoryValidation.validate(req.body, {abortEarly: false})
        return next()
    } catch (err) {
        const yupError = err as yup.ValidationError
        /*Um objeto composto por uam chave e valor string, para salvar todos os erros encontrados pelo YUP
        "Record" é usado em TypeScript para representar um objeto que possui um conjunto de propriedades 
        com chaves (keys) específicas e valores do mesmo tipo.*/
        const errors: Record<string, string> = {}

        //mapeando os erros
        yupError.inner.forEach(error => {
            /*Path se refere o caminho, ou seja vai registrar o caminho da propriedade
            que deu o erro, sendo assim caso ele for undefined eu não devo salvar*/ 
            if(!error.path) return
            errors[error.path] = error.message
        })
        
        return res.status(StatusCodes.BAD_REQUEST).json({ errors })
    }
}

export const create = async (req: Request<{}, {}, ICategory>, res: Response) => {

    console.log(req.body)


    return res.send('Create')
}