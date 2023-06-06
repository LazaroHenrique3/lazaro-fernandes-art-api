import { ETableNames } from '../../ETablesNames'
import { ITechnique } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, technique: Omit<ITechnique, 'id'>): Promise<void | Error> => {
    try {
        //Verificando se já existe technique com esse name
        const existingTechnique = await Knex(ETableNames.technique).where('name', technique.name).andWhereNot('id', id).first()

        if (existingTechnique) {
            return new Error('Já existe uma técnica com esse nome!')
        }

        const result = await Knex(ETableNames.technique).update(technique).where('id', '=', id)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}