import axios from 'axios'

export interface IPriceDeadlineResponse {
    ceporigem: string,
    cepdestino: string,
    valorpac: string,
    prazopac: string,
    valorsedex: string,
    prazosedex: string
}


export interface ITrackOrderResponse {
    data: string,
    descricao: string,
    unidade: string,
    cidade: string,
    uf: string
}

const checkPriceAndDeliveryTime = async (cep: string, weight: number, width: number, length: number, height: number): Promise<IPriceDeadlineResponse | Error> => {

    const url = `https://cepcerto.com/ws/json-frete/${process.env.DEST_CEP}/${String(cep)}/${String(weight)}/${String(height)}/${String(width)}/${String(length)}/${process.env.CEP_CERTO_KEY}`

    try {
        const response = await axios.get(url)

        if (response) {

            const data: IPriceDeadlineResponse = response.data

            //Significa que deu algum erro
            if ('msg' in data && typeof data.msg === 'string') {
                return new Error(data.msg)
            }

            return data
        }

        return new Error('Houve um erro ao consultar valor do frete!')

        /* return {
            //Info de teste
            ceporigem: '87485000',
            cepdestino: '87485000',
            valorpac: '15,60',
            prazopac: '7',
            valorsedex: '30,90',
            prazosedex: '5'
        } */

    } catch (error) {
        console.error('Erro na requisição:', error)
        return new Error('Houve um erro ao consultar valor do frete!')
    }
}

const trackOrder = async (trackingCode: string): Promise<ITrackOrderResponse[] | Error> => {

    const url = `https://www.cepcerto.com/ws/encomenda-json/${trackingCode}/${process.env.CEP_CERTO_KEY}/`

    try {
        const response = await axios.get(url)

        if (response) {

            const data: ITrackOrderResponse[] = response.data

            //Significa que deu algum erro
            if ('erro' in data && typeof data.erro === 'string') {
                return new Error(data.erro)
            }

            return data

        }

        /* return [
            //Info de teste
            {
                data: '2024-02-02T09:09:17',
                descricao: 'Objeto entregue ao destinatário',
                unidade: 'Unidade de Distribuição',
                cidade: 'LOANDA',
                uf: 'PR'
            },
            {
                data: '2024-02-02T08:28:28',
                descricao: 'Objeto saiu para entrega ao destinatário',
                unidade: 'Unidade de Distribuição',
                cidade: 'LOANDA',
                uf: 'PR'
            },
            {
                data: '2024-02-01T16:52:55',
                descricao: 'Objeto em transferência - por favor aguarde',
                unidade: 'Unidade de Tratamento',
                cidade: 'CURITIBA',
                uf: 'PR'
            },
        ] */

        return new Error('Houve um erro ao rastrear pedido!')

    } catch (error) {
        console.error('Erro na requisição:', error)
        return new Error('Houve um erro ao rastrear pedido!')
    }
}

export const Shipping = {
    checkPriceAndDeliveryTime,
    trackOrder
}
