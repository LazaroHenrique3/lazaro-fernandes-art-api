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

export const checkIfAddressIsLinkedToSaleInPreparation = async (idAddress: number): Promise<boolean> => {

    const checkResult = await Knex(ETableNames.sale)
        .select('id')
        .where('address_id', '=', idAddress)
        .andWhere(function () {
            this.where('status', '=', 'Ag. Pagamento')
                .orWhere('status', '=', 'Em preparação')
        })
        .first()

    return checkResult !== undefined
}
