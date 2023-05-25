import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export const seed = async (knex: Knex) => {
    
    const [{ count }] = await knex(ETableNames.accessRoles).count<[{ count: number }]>('* as count')
    if(!Number.isInteger(count) || Number(count) > 0) return

    const rolesToInsert = [
        { name: 'Administrador' },
        { name: 'Ger. de Produto' },
        { name: 'Ger. de Pedidos' },
        { name: 'Ger. Financeiro' },
        { name: 'Atend. Cliente' }
    ]

    await knex(ETableNames.accessRoles).insert(rolesToInsert)
}

