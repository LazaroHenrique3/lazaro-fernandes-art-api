import { ETableNames } from '../../ETablesNames'
import { ICategory } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, category: Omit<ICategory, 'id'>): Promise<void | Error> => {
    try {
        //Verificando se já existe category com esse name
        const existingCategory = await Knex(ETableNames.category).where('name', category.name).andWhereNot('id', id).first()

        if (existingCategory) {
            return new Error('Já existe uma categoria com esse nome!')
        }

        const result = await Knex(ETableNames.category).update(category).where('id', '=', id)

        if (result > 0) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}