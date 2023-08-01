import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.administrator, table => {
        table.bigIncrements('id').primary().index()
        table.string('status', 20).checkLength('<=', 20).notNullable().defaultTo('Ativo')
        table.string('admin_access_level', 20).checkLength('<=', 20).notNullable().defaultTo('Admin')
        table.string('name', 100).checkLength('<=', 100).checkLength('>=', 3).index().notNullable()
        table.string('email', 100).checkLength('<=', 100).checkLength('>=', 5).notNullable().unique().index()
        table.string('password').checkLength('>=', 6).notNullable()

        table.comment('Tabela usada para armazenar os administradores do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.administrator}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.administrator
    ).then(() => {
        console.log(`# Drop table ${ETableNames.administrator}`)
    })
}

