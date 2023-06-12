import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.productDimensions, table => {
        table.bigInteger('product_id').notNullable().index().references('id').inTable(ETableNames.product).onUpdate('CASCADE').onDelete('RESTRICT')
        table.bigInteger('dimension_id').notNullable().index().references('id').inTable(ETableNames.dimension).onUpdate('CASCADE').onDelete('RESTRICT')

        table.comment('Tabela usada para armazenar a relação entre produtos e suas dimensões(cm x cm).')
    }).then(() => {
        console.log(`# Create table ${ETableNames.productDimensions}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.productDimensions
    ).then(() => {
        console.log(`# Drop table ${ETableNames.productDimensions}`)
    })
}

