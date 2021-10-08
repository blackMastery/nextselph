
export interface Role {
    id: number;
    name: string;
    description: string;
    type: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    role: Role;
    created_at: Date;
    updated_at: Date;
}
