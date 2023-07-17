import { ETableNames } from '../../../ETablesNames'
import { Knex } from '../../../knex'

export const checkValidAddressId = async (idAddress: number): Promise<boolean> => {

    const categoryResult = await Knex(ETableNames.address)
        .select('id')
        .where('id', '=', idAddress)
        .first()

    return categoryResult !== undefined
}

export const checkValidCustomerId = async (idCustomer: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.customer)
        .select('id')
        .where('id', '=', idCustomer)
        .first()

    return productResult !== undefined
}
