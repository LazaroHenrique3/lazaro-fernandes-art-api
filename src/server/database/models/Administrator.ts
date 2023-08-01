export interface IAdministrator {
    id: number
    status: string
    admin_access_level: string
    name: string
    email: string
    password: string
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

