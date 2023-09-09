import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.salesItems, table => {
        table.bigInteger('product_id').notNullable().index().references('id').inTable(ETableNames.product).onUpdate('CASCADE').onDelete('RESTRICT')
        table.bigInteger('sale_id').notNullable().index().references('id').inTable(ETableNames.sale).onUpdate('CASCADE').onDelete('RESTRICT')
        table.integer('quantity').unsigned().notNullable()
        table.decimal('price', 10, 2).unsigned().notNullable()
        table.decimal('discount', 10, 2).unsigned().notNullable()

        table.comment('Tabela usada para armazenar os items de venda do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.salesItems}`)
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.salesItems
    ).then(() => {
        console.log(`# Drop table ${ETableNames.salesItems}`)
    })
}
