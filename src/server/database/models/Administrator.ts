export interface IAdministrator {
    id: number
    status: string
    admin_access_level: string
    name: string
    email: string
    password: string
    verification_token?: string | null
    verification_token_expiration?: Date | null
}

export interface IAdministratorRedefinePassword { 
    email: string
    password: string
    confirmPassword: string
    verification_token: string,
    verification_token_expiration?: Date
}

export interface IAdministratorUpdate {
    id: number
    status: string
    admin_access_level: string
    name: string
    email: string
    password?: string
    confirmPassword?: string
}

