import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidTechniqueId = async (idTechnique: number): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.technique)
        .select('id')
        .where('id', '=', idTechnique)
        .first()

    return techniqueResult !== undefined
}

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

export const checkIfTechniqueIsInUse = async (idTechnique: number): Promise<boolean> => {

    const techniqueResult = await Knex(ETableNames.product)
        .select('id').where('technique_id', '=', idTechnique)
        .first()

    return techniqueResult !== undefined

}