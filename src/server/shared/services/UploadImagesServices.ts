import multer from 'multer'
import path from 'path'
import fs from 'fs'

//funciona como uma middleware
const handleFileImage = (multer({
    fileFilter: (req, file, cb) => {
        const extImage = ['image/png', 'image/jpg', 'image/jpeg'].find(formatAccepted => formatAccepted === file.mimetype)

        if (extImage) {
            return cb(null, true)
        }

        return cb(null, false)
    }
}))

const uploadImage = async (image: any, typeImageDir: 'customers' | 'products'): Promise<string> => {
    const uploadDir = path.resolve(__dirname, `../../images/${typeImageDir}`)
    const newFileName = Date.now().toString() + '_' + image.originalname
    const filePath = path.join(uploadDir, newFileName)

    try {
        // Verifica se o diretório de destino existe
        if (!fs.existsSync(uploadDir)) {
            throw new Error('Diretório de destino não encontrado')
        }

        await fs.promises.writeFile(filePath, image.buffer)
        return newFileName
    } catch (error) {
        throw new Error('Erro ao fazer o upload da imagem')
    }
}

const removeImage = (image: string | null, image_src: string | null): Promise<void | Error> => {
    if (image !== null && image_src !== null) {
        return new Promise((resolve, reject) => {
            fs.unlink(image_src, (err) => {
                if (err) {
                    console.error('Erro ao remover a imagem:', err)
                    reject(new Error('Erro ao remover a imagem'))
                } else {
                    resolve()
                }
            })
        })
    } else {
        return Promise.resolve()
    }
}

export const UploadImages = {
    handleFileImage,
    uploadImage,
    removeImage,
}
