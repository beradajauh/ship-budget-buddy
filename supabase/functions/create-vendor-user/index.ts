import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { email, password, vendorId } = await req.json();

    // Input validation
    if (!email || typeof email !== 'string' || email.length > 255) {
      throw new Error('Invalid email address');
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 100) {
      throw new Error('Password must be between 6 and 100 characters');
    }

    if (!vendorId || typeof vendorId !== 'string') {
      throw new Error('Vendor ID is required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    console.log('Creating vendor user for:', { email, vendorId });

    // Check if vendor exists
    const { data: vendor, error: vendorError } = await supabaseClient
      .from('vendor_users')
      .select('email')
      .eq('vendor_id', vendorId)
      .maybeSingle();

    if (vendorError) {
      console.error('Error checking vendor:', vendorError);
      throw new Error('Failed to verify vendor');
    }

    if (vendor) {
      throw new Error('Vendor already has a user account');
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password: password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Auth error:', authError);
      throw new Error(authError.message || 'Failed to create user account');
    }

    console.log('Auth user created:', authData.user.id);

    // Create vendor_users record
    const { data: vendorUser, error: vendorUserError } = await supabaseClient
      .from('vendor_users')
      .insert({
        vendor_id: vendorId,
        email: email.trim().toLowerCase(),
        auth_user_id: authData.user.id,
        status: 'Active'
      })
      .select()
      .single();

    if (vendorUserError) {
      console.error('Vendor user error:', vendorUserError);
      
      // Rollback: delete auth user if vendor_users creation fails
      await supabaseClient.auth.admin.deleteUser(authData.user.id);
      
      throw new Error('Failed to create vendor user record');
    }

    console.log('Vendor user created successfully:', vendorUser.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: vendorUser,
        message: 'Vendor user account created successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in create-vendor-user:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
