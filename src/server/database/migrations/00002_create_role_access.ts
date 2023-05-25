import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.accessRoles, table => {
        table.bigIncrements('id').primary().index()
        table.string('name', 100).checkLength('<=', 100).index().notNullable()
     
        table.comment('Tabela usada para armazenar os cargos dos administradores do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.accessRoles}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.accessRoles
    ).then(() => {
        console.log(`# Drop table ${ETableNames.accessRoles}`)
    })
}

