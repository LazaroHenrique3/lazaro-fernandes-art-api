export interface IAddress {
    id: number
    status: string
    city: string
    state: string
    number: number
    cep: string
    complement?: string
    neighborhood: string
    street: string
    customer_id: number
}

export interface IUpdatedSaleAddress {
    updatedAddress: IAddress,
    estimated_delivery_date: string,
    shipping_method: 'PAC' | 'SEDEX',
    shipping_cost: number
    subtotal: number
}
