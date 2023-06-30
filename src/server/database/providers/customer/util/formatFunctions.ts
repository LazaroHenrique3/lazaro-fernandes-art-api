import { 
    ICustomer, 
    ICustomerUpdate 
} from '../../../models'

import { PasswordCrypto } from '../../../../shared/services'
import { UploadImages } from '../../../../shared/services/UploadImagesServices'

export const formatAndInsertCustomerImagesInDirectory = async (customer: Omit<ICustomer, 'id'>): Promise<Omit<ICustomer, 'id'>> => {

    try {
        //Criptografando a senha
        const hashedPassword = await PasswordCrypto.hashPassword(customer.password)

        //Verificando sew foi passado e inserindo imagem
        if (customer.image !== null) {
            customer.image = await UploadImages.uploadImage(customer.image, 'customers')
        }

        delete customer.confirmPassword

        return {
            ...customer,
            password: hashedPassword,
            cpf: formatCpf(customer.cpf),
            cell_phone: formatCellphone(customer.cell_phone),
            date_of_birth: formatDateOfBirth(customer.date_of_birth)
        }
    } catch (error) {
        throw new Error('Erro ao inserir imagem!')
    }

}

export const formatCustomerForUpdate = async (customer: Omit<ICustomerUpdate, 'id'>): Promise<Omit<ICustomerUpdate, 'id'>> => {

    //Verificando se foi passado a senha para atualização também
    if (customer.password && customer.confirmPassword) {
        //criptografando a senha
        const hashedPassword = await PasswordCrypto.hashPassword(customer.password)
        customer.password = hashedPassword
        delete customer.confirmPassword
    }

    //retornando o objeto formatado
    return {
        ...customer,
        cpf: formatCpf(customer.cpf),
        cell_phone: formatCellphone(customer.cell_phone),
        date_of_birth: formatDateOfBirth(customer.date_of_birth)
    }

}

export const formatCpf = (cpf: string): string => {

    return cpf.replace(/[.-]/g, '')

}

export const formatCellphone = (cellPhone: string): string => {

    return cellPhone.replace(/[()-]/g, '')

}

export const formatDateOfBirth = (date: string | Date): string | Date => {

    return new Date(date).toISOString().split('T')[0]

}