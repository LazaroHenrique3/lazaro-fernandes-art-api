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
    verification_token?: string | null
    verification_token_expiration?: Date | null
}

export interface ICustomerRedefinePassword { 
    email: string
    password: string
    confirmPassword: string
    verification_token: string,
    verification_token_expiration?: Date
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