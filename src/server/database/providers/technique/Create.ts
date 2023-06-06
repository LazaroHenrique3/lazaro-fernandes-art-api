import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { ITechnique } from '../../models'

export const create = async (technique: Omit<ITechnique, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se já existe technique com esse name
        const existingTechnique = await Knex(ETableNames.technique).where('name', technique.name).first()

        if (existingTechnique) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const [result] = await Knex(ETableNames.technique).insert(technique).returning('id')

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