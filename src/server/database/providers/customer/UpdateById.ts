import { ICustomerUpdate } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

export const updateById = async (idCustomer: number, customer: Omit<ICustomerUpdate, 'id'>, accessLevel: string): Promise<void | Error> => {
    try {

        //Só quem pode alterar senha é o próprio customer ou o root
        if (customer.password && accessLevel !== 'Root' && accessLevel !== 'customer') {
            return new Error('Não tem permissão para esse tipo de alteração.')
        }
        
        //Verificando se o id informado é valido
        const existsCustomer = await CustomerUtil.checkValidCustomerId(idCustomer)
        if (!existsCustomer) {
            return new Error('Id informado inválido!')
        }

        const existsEmail = await CustomerUtil.checkValidEmail(customer.email, 'update', idCustomer)
        if (existsEmail) {
            return new Error('Este email já esta cadastrado!')
        }

        const existsCpf = await CustomerUtil.checkValidCpf(customer.cpf, 'update', idCustomer)
        if (existsCpf) {
            return new Error('Este CPF já esta cadastrado!')
        }

        const existsCellPhone = await CustomerUtil.checkValidCellphone(customer.cell_phone, 'update', idCustomer)
        if (existsCellPhone) {
            return new Error('Este telefone já esta cadastrado!')
        }

        const formattedCustomer = await CustomerUtil.formatCustomerForUpdate(customer)

        const result = await CustomerUtil.updateCustomerInDatabase(formattedCustomer, idCustomer)

        return (result > 0) ? void 0 : new Error('Erro ao atualizar registro!')

    } catch (error) {
        console.log(error)
        return new Error('Erro ao atualizar registro!')
    }
}


