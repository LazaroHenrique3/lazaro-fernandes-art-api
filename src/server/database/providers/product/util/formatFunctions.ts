import { IProduct, IProductUpdate } from '../../../models'

import { UploadImages } from '../../../../shared/services/UploadImagesServices'

import { 
    getProductDimensionsById, 
    getProductImagesById 
} from './crudFunctions'

export const formatAndInsertProductImagesInDirectory = async (product: Omit<IProduct, 'id'>): Promise<Omit<IProduct, 'id'>> => {

    try {

        //Inserindo a imagem principal do produto
        const mainImage = await UploadImages.uploadImage(product.main_image[0], 'products')

        //Inserindo as demais imagens/criando um array de promisses
        const promises = product.product_images.map((image) =>
            UploadImages.uploadImage(image, 'products')
        )

        //Aguardar a conclusão de todas as Promises e obter um array com os nomes das imagens
        const productImages = await Promise.all(promises)

        return {
            ...product,
            production_date: formatProductionDate(product.production_date),
            main_image: mainImage,
            product_images: productImages
        }
    } catch (error) {
        throw new Error('Erro ao inserir imagem!')
    }

}

export const formatProductForUpdate = (product: Omit<IProductUpdate, 'id'>): Omit<IProductUpdate, 'id'> => {
    return {
        ...product,
        production_date: formatProductionDate(product.production_date),
    }
}

export const formatAllResultsForResponse = async (productList: IProduct[]): Promise<IProduct[]> => {

    return await Promise.all(
        productList.map(async (product) => {

            //Buscando as dimensoes do produto
            const dimensions = await getProductDimensionsById(product.id)
            //Buscando as imagens do produto
            const images = await getProductImagesById(product.id)

            return {
                ...product,
                dimensions: dimensions,
                product_images: images
            }
        })
    )

}

export const formatResultByIdForResponse = async (product: IProduct, idProduct: number): Promise<IProduct> => {

    //Buscando as dimensoes do produto
    const dimensions = await getProductDimensionsById(idProduct)
    //Buscando as imagens do produto
    const images = await getProductImagesById(idProduct)

    const formattedResult: IProduct = {
        ...product,
        dimensions,
        product_images: images,
    }

    return formattedResult

}

export const formatProductionDate = (productionDate: Date | string): string => {

    const formattedDate = new Date(productionDate).toISOString().split('T')[0]
    return formattedDate

}

export const formattedPrice = (value: number | string) => {

    if(typeof value === 'string') return ''

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

