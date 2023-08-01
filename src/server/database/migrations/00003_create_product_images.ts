import { Knex } from 'knex'
import { ETableNames } from '../ETablesNames'


export async function up(knex: Knex) {
    return knex.schema.createTable(ETableNames.productImages, table => {
        table.bigIncrements('id').primary().index()
        table.bigInteger('product_id').notNullable().index().references('id').inTable(ETableNames.product).onUpdate('CASCADE').onDelete('RESTRICT')
        table.string('name_image', 255).index().notNullable().unique()

        table.comment('Tabela usada para armazenar o nome das imagens dos produtos.')
    }).then(() => {
        console.log(`# Create table ${ETableNames.productImages}`)
    })
}


export async function down(knex: Knex) {
    return knex.schema.dropTable(
        ETableNames.productImages
    ).then(() => {
        console.log(`# Drop table ${ETableNames.productImages}`)
    })
}

