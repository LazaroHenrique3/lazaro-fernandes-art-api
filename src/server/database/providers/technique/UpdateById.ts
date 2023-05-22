import { ETableNames } from '../../ETablesNames'
import { ITechnique } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, technique: Omit<ITechnique, 'id'>): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.technique).update(technique).where('id', '=', id)
        
        if(result > 0) return

        return new Error('Erro au atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro au atualizar registro!')
    }
}