import { SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
export declare class SupabaseService {
    private config;
    private supabase;
    constructor(config: ConfigService);
    get client(): SupabaseClient;
}
