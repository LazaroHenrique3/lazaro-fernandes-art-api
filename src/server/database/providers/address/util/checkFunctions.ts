import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidAddressId = async (idAddress: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.address)
        .select('id')
        .where('id', '=', idAddress)
        .first()

    return categoryResult !== undefined
}