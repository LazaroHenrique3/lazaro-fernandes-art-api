import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.sale, table => {
        table.bigIncrements('id').primary().index()
        table.bigInteger('customer_id').notNullable().index().references('id').inTable(ETableNames.customer).onUpdate('CASCADE').onDelete('RESTRICT')
        table.bigInteger('address_id').notNullable().index().references('id').inTable(ETableNames.address).onUpdate('CASCADE').onDelete('RESTRICT')
        table.string('status', 20).checkLength('<=', 20).notNullable().defaultTo('Ag. Pagamento')
        table.date('order_date').notNullable()
        table.date('estimated_delivery_date').notNullable()
        table.date('payment_due_date').notNullable()
        table.string('payment_method').notNullable()
        table.string('shipping_method').notNullable()
        table.date('payment_received_date').nullable().defaultTo(null)
        table.date('delivery_date').nullable().defaultTo(null)
        table.decimal('shipping_cost', 10, 2).unsigned().nullable().defaultTo(null)

        table.comment('Tabela usada para armazenar as vendas do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.sale}`)
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.sale
    ).then(() => {
        console.log(`# Drop table ${ETableNames.sale}`)
    })
}
