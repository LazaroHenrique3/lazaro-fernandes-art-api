import { ETableNames } from '../../ETablesNames'
import { ITechnique } from '../../models'
import { Knex } from '../../knex'

export const getById = async (id: number): Promise<ITechnique | Error> => {
    try {
        const result = await Knex(ETableNames.technique).select('*').where('id', '=', id).first()
        
        if(result) return result

        return new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
}