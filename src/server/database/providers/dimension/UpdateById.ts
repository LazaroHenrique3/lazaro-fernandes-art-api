import { ETableNames } from '../../ETablesNames'
import { IDimension } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, dimension: Omit<IDimension, 'id'>): Promise<void | Error> => {
    try {
        //Verificando se já existe essa dimension 
        const existingDimension = await Knex(ETableNames.dimension).where('dimension', dimension.dimension).andWhereNot('id', id).first()


        if (existingDimension) {
            return new Error('Essa dimensão já foi cadastrada!')
        }

        const result = await Knex(ETableNames.dimension).update(dimension).where('id', '=', id)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}