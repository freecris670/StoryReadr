import { SupabaseService } from '../supabase/supabase.service';
export declare class AuthService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    validateToken(token: string): Promise<import("@supabase/auth-js").User>;
}
