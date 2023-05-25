import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { ICategory } from '../../models'

export const create = async (category: Omit<ICategory, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se já existe category com esse name
        const existingCategory = await Knex(ETableNames.category).where('name', category.name).first()

        if (existingCategory) {
            return new Error('Já existe uma categoria com esse nome!')
        }

        const [result] = await Knex(ETableNames.category).insert(category).returning('id')

        //Ele pode retorna um ou outro dependendo do banco de dados
        if (typeof result === 'object') {
            return result.id
        } else if (typeof result === 'number') {
            return result
        }

        return new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}