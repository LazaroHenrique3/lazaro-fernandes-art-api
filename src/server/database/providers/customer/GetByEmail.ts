import { ICustomer } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

export const getByEmail = async (email: string): Promise<ICustomer | Error> => {

    try {
        const result = await CustomerUtil.getCustomerByEmail(email)

        return (result) ? result : new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
    
}

