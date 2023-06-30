import { ICustomer } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

export const getById = async (idCustomer: number): Promise<(Omit<ICustomer, 'password'>) | Error> => {

    try {
        const result = await CustomerUtil.getCustomerById(idCustomer)
        
        return (result) ? result : new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }
    
}

