export interface User {
    id: string;
    username: string;
    email?: string;
    name?: string;
    isActive: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (data: AuthResponse) => void;
    logout: () => void;
}