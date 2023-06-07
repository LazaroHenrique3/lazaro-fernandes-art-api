import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { IDimension } from '../../models'

export const create = async (dimension: Omit<IDimension, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se já existe essa dimension 
        const existingDimension = await Knex(ETableNames.dimension).where('dimension', dimension.dimension).first()

        if (existingDimension) {
            return new Error('Essa dimensão já foi cadastrada!')
        }

        const [result] = await Knex(ETableNames.dimension).insert(dimension).returning('id')

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