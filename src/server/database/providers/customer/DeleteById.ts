import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'

import path from 'path'

import { UploadImages } from '../../../shared/services/UploadImagesServices'

export const deleteById = async (id: number): Promise<void | Error> => {
    try {
        const result = await Knex.transaction(async (trx) => {
            // Verificando se existe imagem associada ao cliente, e se sim qual o nome dela para a exclusão
            const customer = await trx(ETableNames.customer).select('image').where('id', '=', id).first()

            let image: any = null 

            if (customer && 'image' in customer) {
                image = customer.image
            }

            const isDeleted = await trx(ETableNames.customer).where('id', '=', id).del()

            //Exluindo a imagem nesse momento pois caso de erro será feito o rollback
            if (image !== null && isDeleted > 0) {
                const destinationPath = path.resolve(__dirname, `../../../images/customers/${image}`)

                UploadImages.removeImage(image, destinationPath)
            }

            return true
        })

        if (result) return

        return new Error('Erro ao apagar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao apagar registro!')
    }
}