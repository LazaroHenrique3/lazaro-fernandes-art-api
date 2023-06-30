export interface ISale {
    id: number
    status: 'Ag. Pagamento' | 'Em preparação' | 'Enviado' | 'Cancelada' | 'Concluída'
    order_date: Date | string
    estimated_delivery_date: Date | string
    payment_due_date: Date | string
    payment_method: string
    shipping_method: string
    payment_received_date?: Date | string
    delivery_date?: Date | string
    shipping_cost?: number
    customer_id: number
    address_id: number   
}

