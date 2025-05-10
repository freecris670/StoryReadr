import { SupabaseService } from '../supabase/supabase.service';
import type { User } from '@supabase/auth-js';
export declare class AuthService {
    private supabaseService;
    constructor(supabaseService: SupabaseService);
    validateToken(accessToken: string, refreshToken: string): Promise<User>;
}
