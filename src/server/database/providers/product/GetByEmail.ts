import { ETableNames } from '../../ETablesNames'
import { ICustomer } from '../../models'
import { Knex } from '../../knex'

export const getByEmail = async (email: string): Promise<ICustomer | Error> => {
    try {
        const result = await Knex(ETableNames.customer).select('*').where('email', '=', email).first()

        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}