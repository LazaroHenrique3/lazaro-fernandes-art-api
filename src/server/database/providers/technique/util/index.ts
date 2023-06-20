import { ETableNames } from '../../../ETablesNames'
import { ITechnique } from '../../../models'
import { Knex } from '../../../knex'

//FUNÇÕES RELACIONADOS AO |CRUD|
//--Faz a criação da nova tecnica no banco de dados
export const insertNewTechniqueInDatabase = async (technique: Omit<ITechnique, 'id'>): Promise<number | undefined> => {

    const [result] = await Knex(ETableNames.technique)
        .insert(technique)
        .returning('id')

    //Ele pode retorna um ou outro dependendo do banco de dados
    if (typeof result === 'object') {
        return result.id
    } else if (typeof result === 'number') {
        return result
    }

    return undefined

}

//Faz a atualização da technique no banco de dados
export const updateTechniqueInDatabase = async (idTechnique: number, technique: Omit<ITechnique, 'id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.technique)
        .update(technique)
        .where('id', '=', idTechnique)

    return result
}

//--Faz a exclusão de Technique do banco de dados
export const deleteTechniqueFromDatabase = async (idTechnique: number): Promise<number> => {

    return await Knex(ETableNames.technique)
        .where('id', '=', idTechnique)
        .del()

}

//--Faz a busca pela tecnica de acordo com o id
export const getTechniqueById = async (idTechnique: number): Promise<ITechnique | undefined> => {

    return await Knex(ETableNames.technique)
        .select('*').where('id', '=', idTechnique)
        .first()

}

//--Faz a busca utilizando o filtro de pesquisa
export const getTechniquesWithFilter = async (filter: string, page: number, limit: number): Promise<ITechnique[]> => {
    return Knex(ETableNames.technique)
        .select('*')
        .where('name', 'like', `%${filter}%`)
        .offset((page - 1) * limit)
        .limit(limit)
}

//--Traz o total de registros correspondentes par aquelas pesquisa
export const getTotalOfRegisters = async (filter: string): Promise<number | undefined> => {
    const [{ count }] = await Knex(ETableNames.dimension)
        .where('dimension', 'like', `%${filter}%`)
        .count<[{ count: number }]>('* as count')

    return count
}

//------//------//

//FUNÇÕES DE VALIDAÇÃO
//--Verifica se o id informado é válido
export const checkValidTechniqueId = async (idTechnique: number): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.technique)
        .select('id')
        .where('id', '=', idTechnique)
        .first()

    return techniqueResult !== undefined
}

//--Verifica se já existe alguma tecnica com esse nome
export const checkValidTechniqueName = async (nameTechnique: string, idTechnique?: number): Promise<boolean> => {

    let techniqueResult = null
    if (idTechnique) {
        techniqueResult = await Knex(ETableNames.technique)
            .where('name', nameTechnique)
            .andWhereNot('id', idTechnique)
            .first()
    } else {
        techniqueResult = await Knex(ETableNames.technique)
            .where('name', nameTechnique)
            .first()
    }

    return techniqueResult !== undefined
}

//--Verifica se a tecnica está em uso antes da exclusão
export const checkIfTechniqueIsInUse = async (idTechnique: number): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.product)
        .select('id').where('technique_id', '=', idTechnique)
        .first()

    return techniqueResult !== undefined

}




