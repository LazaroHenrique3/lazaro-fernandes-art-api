import { Knex } from '../knex'
import { Knex as KnexL } from 'knex'


import { ETableNames } from '../ETablesNames'
import { PasswordCrypto } from '../../shared/services'

export const seed = async (knex: KnexL) => {

    const [{ count }] = await knex(ETableNames.administrator).count<[{ count: number }]>('* as count')
    if (!Number.isInteger(count) || Number(count) > 0) return

    const hashedPassword = await PasswordCrypto.hashPassword('secret1')

    const newAdmin = {
        status: 'Ativo',
        name: 'Teste',
        admin_access_level: 'Root',
        email: 'admin@gmail.com',
        password: hashedPassword,
    }

    //Transaction, para garantir que tanto a inserção das permissions, quanto do adm foram bem sucedidas.
    await Knex.transaction(async (trx) => {
        const [administratorId] = await trx(ETableNames.administrator).insert(newAdmin).returning('id')

        return administratorId
    })
}

