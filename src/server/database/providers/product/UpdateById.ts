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
        
        //Verificando se as dimensões passadas são válidas
        const validDimensions = await checkValidDimensions(product.dimensions.map(Number))
        if (!validDimensions) {
            return new Error('Dimensões inválidas!')
        }

        //Formatando o objeto que será usado na inserção
        const productWithAllProps = formatProductWithAllProps(product)

        //Fluxo de alteração dos dados
        const {dimensions, ...productData} = productWithAllProps

        const result = await Knex.transaction(async (trx) => {
            await updateProductInDatabase(idProduct, productData, trx)
            await deleteOldProductDimensionsInDatabase(idProduct, trx)
            await insertNewProductDimensionsInDatabase(dimensions.map(Number), idProduct, trx)
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

//--Formta corretamente o objeto que será usado para realizar a inserção no banco de dados
const formatProductWithAllProps = (product: Omit<IProductUpdate, 'id'>): Omit<IProductUpdate, 'id'> => {
    return {
        ...product,
        production_date: formatProductionDate(product.production_date),
    }
}

//--Formata a data de produção da forma adequada para o banco de dados
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

