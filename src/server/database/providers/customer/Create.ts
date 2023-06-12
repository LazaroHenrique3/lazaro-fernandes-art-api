import { PasswordCrypto } from '../../../shared/services'
import { ETableNames } from '../../ETablesNames'
import { Knex } from '../../knex'
import { ICustomer } from '../../models'

import { UploadImages } from '../../../shared/services/UploadImagesServices'


export const create = async (customer: Omit<ICustomer, 'id'>): Promise<number | Error> => {
    try {
        //Verificando se já existe cliente com esse email
        const existingCustomerEmail = await Knex(ETableNames.customer).where('email', customer.email).first()

        if (existingCustomerEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        //Verificando se já existe cliente com esse cpf
        const existingCustomerCpf = await Knex(ETableNames.customer).where('cpf', customer.cpf).first()

        if (existingCustomerCpf) {
            return new Error('Este CPF já esta cadastrado!')
        }

        //Verificando se já existe cliente com esse telefone
        const existingCustomerCellPhone = await Knex(ETableNames.customer).where('cell_phone', customer.cell_phone).first()

        if (existingCustomerCellPhone) {
            return new Error('Este telefone já esta cadastrado!')
        }

        //Criptografando a senha
        const hashedPassword = await PasswordCrypto.hashPassword(customer.password)

        //formatando corretamente o objeto de customer
        const formattedCpf = customer.cpf.replace(/[.-]/g, '')
        const formattedCellPhone = customer.cell_phone.replace(/[()-]/g, '')
        const formattedDateOfBirth = new Date(customer.date_of_birth).toISOString().split('T')[0]

        const formattedCustomer = {
            ...customer,
            password: hashedPassword,
            cpf: formattedCpf,
            cell_phone: formattedCellPhone,
            date_of_birth: formattedDateOfBirth
        }

        delete formattedCustomer.confirmPassword

        //Verificando sew foi passado e inserindo imagem
        if (customer.image !== null) {
            try {
                formattedCustomer.image = await UploadImages.uploadImage(customer.image, 'customers')
            } catch (error) {
                return new Error('Erro ao inserir imagem!')
            }
        }

        const [result] = await Knex(ETableNames.customer).insert(formattedCustomer).returning('id')

        //Se tudo correu bem ele deve estar com o id do novo usuário
        if (typeof result === 'number') {
            return result
        } else if (typeof result === 'object') {
            return result.id
        }

        return new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}


