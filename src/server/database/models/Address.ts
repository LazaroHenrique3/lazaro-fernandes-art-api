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