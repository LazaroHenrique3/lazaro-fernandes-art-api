import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.administratorRoleAccess, table => {
        table.bigInteger('administrator_id').notNullable().index().references('id').inTable(ETableNames.administrator).onUpdate('CASCADE').onDelete('RESTRICT')
        table.bigInteger('role_access_id').notNullable().index().references('id').inTable(ETableNames.accessRoles).onUpdate('CASCADE').onDelete('RESTRICT')

        table.comment('Tabela usada para armazenar a relação entre administradores e cargos.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.administratorRoleAccess}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.administratorRoleAccess
    ).then(() => {
        console.log(`# Drop table ${ETableNames.administratorRoleAccess}`)
    })
}

