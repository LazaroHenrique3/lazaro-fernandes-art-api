import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.product, table => {
        table.bigIncrements('id').primary().index()
        table.bigInteger('technique_id').notNullable().index().references('id').inTable(ETableNames.technique).onUpdate('CASCADE').onDelete('RESTRICT')
        table.bigInteger('category_id').notNullable().index().references('id').inTable(ETableNames.category).onUpdate('CASCADE').onDelete('RESTRICT')
        table.string('status', 20).checkLength('<=', 20).notNullable().defaultTo('Ativo')
        table.string('status_of_sale', 20).checkLength('<=', 20).notNullable()
        table.string('orientation', 20).checkLength('<=', 20).notNullable()
        table.string('title', 100).checkLength('<=', 100).index().notNullable()
        table.string('main_image').notNullable()
        table.string('type', 20).checkLength('<=', 20).notNullable()
        table.integer('quantity').unsigned().nullable().defaultTo(null)
        table.date('production_date').notNullable()
        table.string('description').nullable().defaultTo(null)
        table.float('weight').unsigned().nullable().defaultTo(null)
        table.decimal('price', 10, 2).unsigned().nullable().defaultTo(null)

        table.comment('Tabela usada para armazenar os produtos do sistema.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.product}`)
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.product
    ).then(() => {
        console.log(`# Drop table ${ETableNames.product}`)
    })
}
