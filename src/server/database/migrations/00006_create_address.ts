import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.address, table => {
        table.bigIncrements('id').primary().index()
        table.string('status', 20).checkLength('<=', 20).notNullable()
        table.string('city', 45).checkLength('<=', 45).notNullable()
        table.string('state', 45).checkLength('<=', 45).notNullable()
        table.integer('number').unsigned().notNullable()
        table.string('cep', 8).checkLength('=', 8).notNullable()
        table.string('complement').nullable()
        table.string('neighborhood').notNullable()
        table.string('street').notNullable()
        table.bigInteger('customer_id').notNullable().index().references('id').inTable(ETableNames.customer).onUpdate('CASCADE').onDelete('RESTRICT')

        table.comment('Tabela usada para armazenar o endereço dos clientes do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.address}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.address
    ).then(() => {
        console.log(`# Drop table ${ETableNames.address}`)
    })
}
