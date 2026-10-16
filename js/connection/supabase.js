import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jcdgbbxyciimjbawjkvs.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_8KaIoOw7LhWoGOGHGoIrsg_sw3g8JsF';

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
);