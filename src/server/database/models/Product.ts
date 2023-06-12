export interface IProduct {
    id: number
    status: 'Ativo' | 'Vendido' | 'Inativo'
    status_of_sale: 'Venda' | 'Galeria'
    title: string
    type: 'Original' | 'Print'
    orientation: 'Retrato' | 'Paisagem'
    quantity?: number
    production_date: Date | string
    description?: string
    weight?: number
    price?: number
    main_image: any
    dimensions: string[] | number[]
    product_images: any[]
    technique_id: number
    category_id: number
}
