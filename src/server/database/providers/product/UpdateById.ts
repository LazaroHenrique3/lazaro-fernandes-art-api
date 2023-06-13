import { ETableNames } from '../../ETablesNames'
import { IProductUpdate } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, product: Omit<IProductUpdate, 'id'>): Promise<void | Error> => {
    try {
        //TODO - VERIFICAR A EXISTENCIA DO PRODUCT ANTES DE TUDO
        //Verificando se as dimensões passadas são válidas
        const { dimensions } = product

        //convertendo para um array numérico, e verificando se são válidas
        const dimensionNumberArray = dimensions.map(Number)

        const [{ count }] = await Knex(ETableNames.dimension).whereIn('id', dimensionNumberArray).count<[{ count: number }]>('* as count')

        if (count !== dimensions.length) {
            return new Error('Dimensões inválidas!')
        }

        //Formatando a data de produção
        const formattedProductionDate = new Date(product.production_date).toISOString().split('T')[0]

        //Product com todas as propriedades, para fazer o insert eu devo remover algumas delas
        const productWithAllProps = {
            ...product,
            production_date: formattedProductionDate
        }

        //Transaction, para garantir que todas alterações sejam bem sucedidas.
        const result = await Knex.transaction(async (trx) => {
            //Pegando as props que preciso para o insert de product
            const { dimensions, ...insertProductData } = productWithAllProps

            //Atualizando a tabela de produtos
            await trx(ETableNames.product).update(insertProductData).where('id', '=', id)

            // Deletando as dimensões existentes do administrador
            await trx(ETableNames.productDimensions).where('product_id', id).del()

            //Preparando o objeto com as novas dimensões
            const dimensionsData = dimensions.map((dimensionId) => ({
                product_id: id,
                dimension_id: dimensionId
            }))

            //armazenando a nova relação de dimensões no banco
            await trx(ETableNames.productDimensions).insert(dimensionsData)

            return true
        })

        if (result === true) return

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}