import { RequestHandler } from 'express'
import { AnyObject, Maybe, ObjectSchema, ValidationError } from 'yup'
import { StatusCodes } from 'http-status-codes'

type TProperty = 'body' | 'header' | 'params' | 'query' | 'file' | 'files'

//Uso o generic, para que o tipo sejá definido no momento de uso da função
type TGetSchema = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => ObjectSchema<T>

/*Passar todos schemas a serem validades de uma única vez dentro de um
objeto chave valor, onde em um eu armazenoqual a prop da request eu 
quero validar e no outro o schema a ser usado.*/
type TAllSchemas = Record<TProperty, ObjectSchema<any>>

type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>

//Transforma de fato em umamiddleware dando acesso á (req, res, next)
//O partial de forma bem resumida faz com que nem todas as propriedades 
//Que estão vindo sejam obrigatórias, ja que nem todas as vezes nõs precisamos validar
//todas elas.
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler

//Retornando uma função/middleware que será nossa middleware
export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
    const schemas = getAllSchemas(schema => schema)

    const errorsResult: Record<string, Record<string, string>> = {}

    //Transformando em um Array, para realizar o loop e validar todos os Schemas
    Object.entries(schemas).forEach(([key, schema]) => {
        try {
            schema.validateSync(req[key as TProperty], { abortEarly: false })
        } catch (err) {
            const yupError = err as ValidationError
            /*Um objeto composto por uma chave e valor string, para salvar todos os erros encontrados pelo YUP
            "Record" é usado em TypeScript para representar um objeto que possui um conjunto de propriedades 
            com chaves (keys) específicas e valores do mesmo tipo.*/
            const errors: Record<string, string> = {}

            //mapeando os erros
            yupError.inner.forEach(error => {
                /*Path se refere o caminho, ou seja vai registrar o caminho da propriedade
                que deu o erro, sendo assim caso ele for undefined eu não devo salvar*/
                if (!error.path) return
                errors[error.path] = error.message
            })

            errorsResult[key] = errors

        }
    })

    //Se tudo foi validado como correto, será retornado um array com um legth 0
    if (Object.entries(errorsResult).length === 0) {
        return next()
    } else {
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult })
    }
}
