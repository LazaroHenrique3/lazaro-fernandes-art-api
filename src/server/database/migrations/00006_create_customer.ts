import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.customer, table => {
        table.bigIncrements('id').primary().index()
        table.string('status', 20).checkLength('<=', 20).notNullable().defaultTo('Ativo')
        table.string('image').nullable()
        table.string('name', 100).checkLength('<=', 100).checkLength('>=', 3).index().notNullable()
        table.string('email', 100).checkLength('<=', 100).checkLength('>=', 5).notNullable().unique().index()
        table.string('password').checkLength('>=', 6).notNullable()
        table.string('cell_phone', 11).checkLength('=', 11).unique().notNullable()
        table.string('genre', 1).notNullable()
        table.date('date_of_birth').notNullable()
        table.string('cpf', 11).checkLength('=', 11).notNullable().unique().index()
        table.string('verification_token').nullable()
        table.string('verification_token_expiration').nullable()

        table.comment('Tabela usada para armazenar os clientes do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.customer}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.customer
    ).then(() => {
        console.log(`# Drop table ${ETableNames.customer}`)
    })
}
