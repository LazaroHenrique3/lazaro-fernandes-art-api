import { ETableNames } from '../../../ETablesNames'
import { IAddress } from '../../../models'
import { Knex } from '../../../knex'

export const getAddressById = async (idAddress: number, idCustomer: number): Promise<IAddress | undefined> => {

    return await Knex(ETableNames.address).select('*')
        .where('id', '=', idAddress)
        .andWhere('customer_id', '=', idCustomer)
        .first()

}

export const getAddressWithFilter = async (filter: string, page: number, limit: number, idAdress: number, idCustomer: number, showInative: boolean): Promise<IAddress[]> => {

    return await Knex(ETableNames.address)
        .select('*')
        .where('customer_id', '=', idCustomer)
        .andWhere(function () {
            this.where('id', idAdress)
                .orWhere('street', 'like', `%${filter}%`)
        })
        .andWhereNot('status', '=', `${(showInative) ? '' : 'Inativo'}`)
        .offset((page - 1) * limit)
        .limit(limit)
        .orderByRaw(`
        CASE 
            WHEN status = 'Ativo' THEN 1
            WHEN status = 'Inativo' THEN 2
        END
        ASC
        `)

}

export const getTotalOfRegisters = async (filter: string, idAdress: number, idCustomer: number, showInative: boolean): Promise<number | undefined> => {
    const [{ count }] = await Knex(ETableNames.address)
        .where('customer_id', '=', idCustomer)
        .andWhere(function () {
            this.where('id', idAdress)
                .orWhere('street', 'like', `%${filter}%`)
        })
        .andWhereNot('status', '=', `${(showInative) ? '' : 'Inativo'}`)
        .count<[{ count: number }]>('* as count')

    return count
}

export const insertNewAddressInDatabase = async (address: Omit<IAddress, 'id'>): Promise<number | undefined> => {

    const [result] = await Knex(ETableNames.address)
        .insert(address)
        .returning('id')

    //Ele pode retorna um ou outro dependendo do banco de dados
    if (typeof result === 'object') {
        return result.id
    } else if (typeof result === 'number') {
        return result
    }

    return undefined

}

export const updateAddressInDatabase = async (idAddress: number, idCustomer: number, address: Omit<IAddress, 'id' | 'customer_id'>): Promise<number | undefined> => {

    const result = await Knex(ETableNames.address).update(address)
        .where('id', '=', idAddress)
        .andWhere('customer_id', '=', idCustomer)

    return result
}

export const deleteAddressFromDatabase = async (idAddress: number): Promise<number> => {

    return await Knex(ETableNames.address)
        .where('id', '=', idAddress)
        .del()

}