import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'


export const deleteImageById = async (id: number): Promise<void | Error> => {
    try {
        const result = await Knex.transaction(async (trx) => {
            // Verificando se existe imagem associada ao cliente, e se sim qual o nome dela para a exclusão
            const customer = await trx(ETableNames.customer).select('image').where('id', '=', id).first()

            let image: any = null

            if (customer && 'image' in customer) {
                image = customer.image
            }

            if (image !== null) {

                //setando para null
                const isUpdated = await trx(ETableNames.customer).update({ image: null }).where('id', '=', id)

                if (isUpdated > 0) {
                    //Exluindo a imagem nesse momento pois caso de erro será feito o rollback
                    const destinationPath = path.resolve(__dirname, `../../../images/customers/${image}`)

                    UploadImages.removeImage(image, destinationPath)
                }
            }
            return true
        })

        if (result) return

        return new Error('Erro ao apagar Imagem!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar Imagem!')
    }
}