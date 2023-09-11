import { IAddress } from './Address'

export interface ISaleItems {
    idProduct: number
    quantity: number
    discount?: number
}

export interface ISale {
    id: number
    status: 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'
    order_date: Date | string
    estimated_delivery_date: Date | string
    payment_due_date: Date | string
    payment_method: 'PIX' | 'BOLETO' | 'C. CREDITO' | 'C. DEBITO'
    shipping_method: 'PAC' | 'SEDEX'
    payment_received_date?: Date | string
    delivery_date?: Date | string
    shipping_cost: number
    customer_id: number
    address_id: number
    sale_items: ISaleItems[]
}

export interface ISaleItemsList {
    product_id: number
    sale_id: number
    quantity: number
    price: number
    discount: number
    product_title: string
}

export interface ISaleList {
    id: number
    status: 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'
    order_date: Date | string
    estimated_delivery_date: Date | string
    payment_due_date: Date | string
    payment_method: 'PIX' | 'BOLETO' | 'C. CREDITO' | 'C. DEBITO'
    shipping_method: 'PAC' | 'SEDEX'
    payment_received_date?: Date | string
    delivery_date?: Date | string
    shipping_cost: number
    customer_id: number
    address_id: number
    sale_items: ISaleItemsList[]
    sale_address: IAddress
}

