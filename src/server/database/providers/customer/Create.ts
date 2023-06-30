import { ICustomer } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

export const create = async (customer: Omit<ICustomer, 'id'>): Promise<number | Error> => {
    try {
        const existsEmail = await CustomerUtil.checkValidEmail(customer.email, 'insert')
        if (existsEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        const existsCpf = await CustomerUtil.checkValidCpf(customer.cpf, 'insert')
        if (existsCpf) {
            return new Error('Este CPF já esta cadastrado!')
        }

        const existsCellPhone = await CustomerUtil.checkValidCellphone(customer.cell_phone, 'insert')
        if (existsCellPhone) {
            return new Error('Este telefone já esta cadastrado!')
        }


        //Formatando e inserindo a imagem no diretório da aplicação, e pegando seu nome para inserir no banco
        let customerFormatedAndWithNameOfImageUploaded: Omit<ICustomer, 'id'>

        try {
            customerFormatedAndWithNameOfImageUploaded = await CustomerUtil.formatAndInsertCustomerImagesInDirectory(customer)
        } catch (error) {
            return new Error('Erro ao criar registro!')
        }

        const result = await CustomerUtil.insertNewCustomerInDatabase(customerFormatedAndWithNameOfImageUploaded)

        return (result) ? result : new Error('Erro ao criar registro!')
    } catch (error) {
        console.log(error)
        return new Error('Erro ao criar registro!')
    }
}







