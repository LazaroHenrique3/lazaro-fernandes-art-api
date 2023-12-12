import * as yup from 'yup'
import sizeOf from 'image-size'

//Número máximo de imagens para upload
export const MAX_PRODUCT_IMAGES = 4

//Tamanhos recomendados em pixels
const MIN_H_MAIN_IMAGE = 1070
const MAX_H_MAIN_IMAGE = 1090
const MIN_W_MAIN_IMAGE = 705
const MAX_W_MAIN_IMAGE = 725

const MIN_H_PRODUCT_IMAGES = 720
const MAX_H_PRODUCT_IMAGES = 740
const MIN_W_PRODUCT_IMAGES = 690
const MAX_W_PRODUCT_IMAGES = 710

//Verifica se de fato foi passado uma imagem
// eslint-disable-next-line 
export const existsImage = (imageLength: number, value: any | undefined): void => {
    if (imageLength === 0) {
        throw new yup.ValidationError('A imagem é obrigatória!', value, 'main_image')
    }
}

//Verifica se foi pasado imagens e se não excedeu o máximo d eimagens aceitas
// eslint-disable-next-line 
export const existsImagesAndIsSmallerThanMax = (imagesLength: number, value: any | undefined) => {
    if (imagesLength === 0) {
        throw new yup.ValidationError('As imagens são obrigatórias!', value, 'product_images')
    } else if (imagesLength > MAX_PRODUCT_IMAGES) {
        throw new yup.ValidationError(`É permitido o upload de até ${MAX_PRODUCT_IMAGES} imagens!`, value, 'product_images')
    }
}

//Verifica se a imagem fornecida é do formato correto
// eslint-disable-next-line 
export const isValidType = (imageType: Express.Multer.File[], value: any | undefined): void => {
    const supportedFormats = ['image/jpeg', 'image/png', 'image/jpg']

    //Caso esteja validando as imagens de produtos irá ser informado um array de Express.Multer.File
    if (imageType.length > 1) {
        for (let i = 0; i < imageType.length; i++) {
            const image = imageType[i]
            if (!supportedFormats.includes(image.mimetype)) {
                throw new yup.ValidationError('Formato de imagem inválido!', value, 'product_images')
            }
        }
    } else {
        if (!supportedFormats.includes(imageType[0].mimetype)) {
            throw new yup.ValidationError('Formato de imagem inválido!', value, 'main_image')
        }
    }
}

//Verifica se a imagem respeita o tamanho limite em MB
// eslint-disable-next-line 
export const isValidSize = (imageSize: Express.Multer.File[], value: any | undefined): void => {
    const maxSize = 2 * 1024 * 1024 // 2MB

    //Caso esteja validando as imagens de produtos irá ser informado um array de Express.Multer.File
    if (imageSize.length > 1) {
        for (let i = 0; i < imageSize.length; i++) {
            const image = imageSize[i]
            if (Number(image.size) > maxSize) {
                throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'product_images')
            }
        }
    } else {
        if (Number(imageSize[0].size) > maxSize) {
            throw new yup.ValidationError('Tamanho de imagem excede 2MB!', value, 'main_image')
        }
    }
}

//Verifica se as dimensões estão dentro do esperado, utilizado na middleware de cadastro de Produto
// eslint-disable-next-line 
export const isValidMainImageDimensions = (image: Express.Multer.File[], value: any | undefined): void => {
    //Descobre as dimensões das imagens através do buffer que é enviado pelo frontend
    const { height, width } = sizeOf(image[0].buffer)

    //Caso aconteça algum erro e não retorne corretamente
    if (height === undefined || width === undefined) {
        throw new yup.ValidationError('Houve um erro ao obter dimensões.', value, 'main_image')
    }

    //Faz a verificação se esta conforme o esperado
    const isValidDimension = checkMainImageDimensions(height, width)

    //Caso não esteja seguindo as dimensões é retornado o erro
    if (!isValidDimension) {
        throw new yup.ValidationError('Ás dimensões deve ser entre (1070 a 1090 X 705 a 725)pixels.', value, 'main_image')
    }

}

//Verifica se as dimensões estão dentro do esperado, utilizado na middleware de cadastro de Produto
// eslint-disable-next-line 
export const isValidProductImagesDimensions = (images: Express.Multer.File[], value: any | undefined): void => {

    //Percorrendo todas as imagens
    for (let i = 0; i < images.length; i++) {
        //Descobre as dimensões das imagens através do buffer que é enviado pelo frontend
        const { height, width } = sizeOf(images[i].buffer)

        //Caso aconteça algum erro e não retorne corretamente
        if (height === undefined || width === undefined) {
            throw new yup.ValidationError('Houve um erro ao obter dimensões.', value, 'product_images')
        }

        //Faz a verificação se esta conforme o esperado
        const isValidDimension = checkProductImagesDimensions(height, width)

        //Caso não esteja seguindo as dimensões é retornado o erro
        if (!isValidDimension) {
            throw new yup.ValidationError('Ás dimensões deve ser entre (690 a 710 X 720 a 740)pixels..', value, 'product_images')
        }
    }
}

//Funções auxiliares
//Compara se as dimensões da imagem principal são válidas
const checkMainImageDimensions = (imageHeight: number, imageWidth: number): boolean => {
    return (imageHeight >= MIN_H_MAIN_IMAGE && imageHeight <= MAX_H_MAIN_IMAGE) && (imageWidth >= MIN_W_MAIN_IMAGE && imageWidth <= MAX_W_MAIN_IMAGE)
}

//Compara se as imagens do produto são válidas
const checkProductImagesDimensions = (imageHeight: number, imageWidth: number): boolean => {
    return (imageHeight >= MIN_H_PRODUCT_IMAGES && imageHeight <= MAX_H_PRODUCT_IMAGES) && (imageWidth >= MIN_W_PRODUCT_IMAGES && imageWidth <= MAX_W_PRODUCT_IMAGES)
}


