import { ETableNames } from '../../ETablesNames'
import { ITechnique } from '../../models'
import { Knex } from '../../knex'

//Recebe aquele id para caso um item não esteja na primeira pagina, ele possa retornar junto
export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<ITechnique[] | Error> => {
    try {
        const result = await Knex(ETableNames.technique)
            .select('*')
            .where('id', Number(id))
            .orWhere('name', 'like', `%${filter}%`)
            .offset((page - 1) * limit)
            .limit(limit)

        //Caso passe um id, e ele não esteja na pagina em questão, porém eu desejo retornar ele junto
        if (id > 0 && result.every(item => item.id !== id)) {
            const resultById = await Knex(ETableNames.technique)
                .select('*')
                .where('id', '*', id)
                .first()

            if (resultById) return [...result, resultById]
        }

        return result
    } catch (error) {
        console.log(error)
        return new Error('Erro ao consultar registros!')
    }
}