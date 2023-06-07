import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.dimension, table => {
        table.bigIncrements('id').primary().index()
        table.string('dimension', 100).checkLength('<=', 20).index().notNullable().unique()

        table.comment('Tabela usada para armazenar as dimensões(cm x cm) utilizadas nos produtos.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.dimension}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.dimension
    ).then(() => {
        console.log(`# Drop table ${ETableNames.dimension}`)
    })
}

