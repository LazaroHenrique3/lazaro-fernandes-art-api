import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.technique, table => {
        table.bigIncrements('id').primary().index()
        table.string('status', 20).checkLength('<=', 20).notNullable().defaultTo('Ativo')
        table.string('name', 100).checkLength('<=', 100).index().notNullable().unique()

        table.comment('Tabela usada para armazenar tecnicas utilizadas nos produtos.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.technique}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.technique
    ).then(() => {
        console.log(`# Drop table ${ETableNames.technique}`)
    })
}

