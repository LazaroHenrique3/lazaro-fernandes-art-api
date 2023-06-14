import { ETableNames } from '../../ETablesNames'
import { IProductUpdate } from '../../models'
import { Knex } from '../../knex'
import { Knex as knex } from 'knex'


export const updateById = async (idProduct: number, product: Omit<IProductUpdate, 'id'>): Promise<void | Error> => {
    try {
        //Verificando se o id informado é valido
        const existsProduct = await checkValidProductId(idProduct)
        if (!existsProduct) {
            return new Error('Id informado inválido!')
        }
        
        const { dimensions, production_date, ...productData } = product

        //convertendo para um array numérico, e verificando se são válidos
        const dimensionNumberArray = dimensions.map(Number)

        const validDimensions = await checkValidDimensions(dimensionNumberArray)
        if (!validDimensions) {
            return new Error('Invalid dimensions!')
        }

        //Formatando a string de data de produção
        const formattedProductionDate = formatProductionDate(production_date)

        const productWithAllProps = {
            ...productData,
            production_date: formattedProductionDate,
        }

        //Fluxo de alteração dos dados
        const result = await Knex.transaction(async (trx) => {
            await updateProductInDatabase(idProduct, productWithAllProps, trx)
            await deleteOldProductDimensionsInDatabase(idProduct, trx)
            await insertNewProductDimensionsInDatabase(dimensionNumberArray, idProduct, trx)
        })

        if (result === undefined) {
            return
        } 

        return new Error('Erro ao atualizar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}

//Funções auxiliares
//--Faz a checagem se o id passado é valido e já impede o prcessamento desnecessário
const checkValidProductId = async (idProduct: number): Promise<boolean> => {

    const productResult = await Knex(ETableNames.product)
        .select('id')
        .where('id', '=', idProduct)
        .first()

    return productResult !== undefined
}

//--Faz a checagem se os Ids de dimensões passadas são válidos
const checkValidDimensions = async (dimensions: number[]): Promise<boolean> => {
    const [{ count }] = await Knex(ETableNames.dimension)
        .whereIn('id', dimensions)
        .count<[{ count: number }]>('* as count')
    return count === dimensions.length
}

//--Formata a de dato de produção da forma adequada para o banco de dados
const formatProductionDate = (productionDate: Date | string): string => {
    const formattedDate = new Date(productionDate).toISOString().split('T')[0]
    return formattedDate
}

//--Atualiza o produto com as novas informações no banco de dados
const updateProductInDatabase = async (id: number, productData: Omit<IProductUpdate, 'id' | 'dimensions'>, trx: knex.Transaction): Promise<void> => {
    await trx(ETableNames.product).update(productData).where('id', '=', id)
}

//--Deleta a antiga relação de dimensões no banco de dados
const deleteOldProductDimensionsInDatabase = async (productId: number, trx: knex.Transaction): Promise<void> => {
    await trx(ETableNames.productDimensions).where('product_id', productId).del()
}

//--Insere a nova relação de dimensões no banco de dados
const insertNewProductDimensionsInDatabase = async (dimensions: number[], productId: number, trx: knex.Transaction): Promise<void> => {
    const dimensionsData = dimensions.map((dimensionId) => ({
        product_id: productId,
        dimension_id: dimensionId,
    }))
    await trx(ETableNames.productDimensions).insert(dimensionsData)
}

