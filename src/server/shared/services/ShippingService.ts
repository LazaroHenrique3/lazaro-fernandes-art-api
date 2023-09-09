import {
    PrecoPrazoResponse,
    calcularPrecoPrazo,
} from 'correios-brasil'

const checkPriceAndDeliveryTime = async (cep: string, weight: number, width: number, length: number, height: number): Promise<PrecoPrazoResponse[] | Error> => {

    try {
        const args = {
            sCepOrigem: '87485000',
            sCepDestino: String(cep),
            nVlPeso: String(weight),
            nCdFormato: '1',
            nVlComprimento: String(length),
            nVlAltura: String(height),
            nVlLargura: String(width),
            nCdServico: ['04510', '04014'],
            nVlDiametro: '0',
        }

        const result = calcularPrecoPrazo(args).then(response => {
            return response
        })

        return result
    } catch (error) {
        console.error('Ocorreu um erro:', error)
        return new Error('Houve um erro ao consultar valor do frete!')
    }
}

export const Shipping = {
    checkPriceAndDeliveryTime
}
