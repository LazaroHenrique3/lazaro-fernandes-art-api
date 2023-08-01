export interface IProduct {
    id: number
    status: 'Ativo' | 'Vendido' | 'Inativo'
    title: string
    orientation: 'Retrato' | 'Paisagem'
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    main_image: any
    product_images: any[]
    dimension_id: number
    technique_id: number
    category_id: number
}

export interface IProductUpdate {
    id: number
    status: 'Ativo' | 'Vendido' | 'Inativo'
    title: string
    orientation: 'Retrato' | 'Paisagem'
    quantity: number
    production_date: Date | string
    description?: string
    weight: number
    price: number
    dimension_id: number
    technique_id: number
    category_id: number
}

export interface IImageProductList {
    id: number
    name_image: string
}
