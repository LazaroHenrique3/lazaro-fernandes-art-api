import { ETableNames } from '../../ETablesNames'
import { ICategory } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, category: Omit<ICategory, 'id'>): Promise<void | Error> => {
    try {
        const result = await Knex(ETableNames.category).update(category).where('id', '=', id)
        
        if(result > 0) return

        return new Error('Erro au atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro au atualizar registro!')
    }
}