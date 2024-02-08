import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'

export async function up(knex: Knex) {
    await knex.raw('PRAGMA foreign_keys = OFF')

    await knex.schema.alterTable(ETableNames.address, table => {
        table.dropForeign(['customer_id'])
        table.foreign('customer_id').references('id').inTable(ETableNames.customer).onDelete('CASCADE').onUpdate('CASCADE')
    })

    await knex.raw('PRAGMA foreign_keys = ON')

    console.log(`# Altered table ${ETableNames.address} to add ON DELETE CASCADE`)
}

export async function down(knex: Knex) {
    await knex.raw('PRAGMA foreign_keys = OFF')

    await knex.schema.alterTable(ETableNames.address, table => {
        table.dropForeign(['customer_id'])
        table.foreign('customer_id').references('id').inTable(ETableNames.customer).onDelete('RESTRICT').onUpdate('CASCADE')
    })

    await knex.raw('PRAGMA foreign_keys = ON')

    console.log(`# Reverted table ${ETableNames.address} to remove ON DELETE CASCADE`)
}