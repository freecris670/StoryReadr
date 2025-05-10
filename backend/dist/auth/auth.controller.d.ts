import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    profile(auth: string): Promise<{
        id: string;
        email: string | undefined;
        user_metadata: import("@supabase/auth-js").UserMetadata;
    }>;
}
