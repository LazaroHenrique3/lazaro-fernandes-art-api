import { ETableNames } from '../../ETablesNames'
import { ICustomer } from '../../models'
import { Knex } from '../../knex'

export const getById = async (id: number): Promise<(Omit<ICustomer, 'password'>) | Error> => {
    try {
        const result = await Knex(ETableNames.customer).select('id', 'status', 'image', 'name', 'email', 'cell_phone', 'genre', 'date_of_birth', 'cpf')
            .where('id', '=', id).first()

        if (result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}