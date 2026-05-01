import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yencenwhoarvzhxsbkpf.supabase.co";

const supabasePublishableKey = "sb_publishable_SxKc-qEmxxpPecO-UJFX6g_Vuibgn1D";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);