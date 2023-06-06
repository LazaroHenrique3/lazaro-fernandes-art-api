import { PasswordCrypto } from '../../../shared/services'
import { ETableNames } from '../../ETablesNames'
import { ICustomerUpdate } from '../../models'
import { Knex } from '../../knex'

export const updateById = async (id: number, customer: Omit<ICustomerUpdate, 'id'>): Promise<void | Error> => {
    try {
        //Verificando se já existe cliente com esse email
        const existingCustomerEmail = await Knex(ETableNames.customer).where('email', customer.email).andWhereNot('id', id).first()

        if (existingCustomerEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        //Verificando se já existe cliente com esse cpf
        const existingCustomerCpf = await Knex(ETableNames.customer).where('cpf', customer.cpf).andWhereNot('id', id).first()

        if (existingCustomerCpf) {
            return new Error('Este CPF já esta cadastrado!')
        }

        //Verificando se já existe cliente com esse telefone
        const existingCustomerCellPhone = await Knex(ETableNames.customer).where('cell_phone', customer.cell_phone).andWhereNot('id', id).first()

        if (existingCustomerCellPhone) {
            return new Error('Este telefone já esta cadastrado!')
        }

        //Verificando se foi passado a senha para atualização também
        if(customer.password && customer.confirmPassword){
            //criptografando a senha
            const hashedPassword = await PasswordCrypto.hashPassword(customer.password)
            customer.password = hashedPassword
            delete customer.confirmPassword
        }

        //formatando corretamente o objeto de customer
        const formattedCpf = customer.cpf.replace(/[.-]/g, '')
        const formattedCellPhone = customer.cell_phone.replace(/[()-]/g, '')
        const formattedDateOfBirth = new Date(customer.date_of_birth).toISOString().split('T')[0]

        const formattedCustomer = { ...customer, cpf: formattedCpf, cell_phone: formattedCellPhone, date_of_birth: formattedDateOfBirth }

        const result = await Knex(ETableNames.customer).update(formattedCustomer).where('id', '=', id)

        if (result > 0) return 

        return new Error('Erro ao atualizar registro!') 
    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}