export interface ICustomer {
    id: number
    status: 'Ativo' | 'Inativo'
    image: any
    name: string
    email: string
    password: string
    confirmPassword?: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
}

export interface ICustomerUpdate {
    id: number
    status: 'Ativo' | 'Inativo'
    name: string
    email: string
    password?: string
    confirmPassword?: string
    cell_phone: string
    genre: 'M' | 'F' | 'L' | 'N'
    date_of_birth: Date | string
    cpf: string
}