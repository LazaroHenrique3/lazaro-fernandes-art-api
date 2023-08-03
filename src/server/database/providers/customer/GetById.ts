import { ICustomer } from '../../models'

//Funções auxiliares
import { CustomerUtil } from './util'

export const getById = async (idCustomer: number): Promise<(Omit<ICustomer, 'password'>) | Error> => {

    try {
        const result = await CustomerUtil.getCustomerById(idCustomer)

        let image = ''
        if (result?.image !== undefined && result?.image !== null) {
            image = `${process.env.LOCAL_ADDRESS}/files/customers/${result?.image}`
        }

        return (result) ? {...result, image} : new Error('Registro não encontrado!')
    } catch (error) {
        console.log(error)
        return new Error('Registro não encontrado!')
    }

}

