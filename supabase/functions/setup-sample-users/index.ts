import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    console.log('Creating sample users...');

    // Get or create admin user
    let adminAuthId;
    
    // Check if admin auth user already exists
    const { data: { users: existingAdminAuth } } = await supabaseClient.auth.admin.listUsers();
    const existingAdmin = existingAdminAuth.find(u => u.email === 'admin@company.com');
    
    if (existingAdmin) {
      console.log('Admin auth already exists:', existingAdmin.id);
      adminAuthId = existingAdmin.id;
    } else {
      // Create new admin auth user
      const { data: adminAuth, error: adminAuthError } = await supabaseClient.auth.admin.createUser({
        email: 'admin@company.com',
        password: 'admin123',
        email_confirm: true,
        user_metadata: { full_name: 'Admin User' }
      });

      if (adminAuthError) {
        console.error('Admin auth error:', adminAuthError);
        throw new Error(`Failed to create admin auth: ${adminAuthError.message}`);
      }

      console.log('Admin auth created:', adminAuth.user.id);
      adminAuthId = adminAuth.user.id;
    }

    // Check if admin_users record already exists
    const { data: existingAdminUser } = await supabaseClient
      .from('admin_users')
      .select('id')
      .eq('email', 'admin@company.com')
      .maybeSingle();

    if (!existingAdminUser) {
      const { error: adminUserError } = await supabaseClient
        .from('admin_users')
        .insert({
          email: 'admin@company.com',
          auth_user_id: adminAuthId,
          full_name: 'Admin User',
          role: 'admin',
          status: 'Active'
        });

      if (adminUserError) {
        console.error('Admin user error:', adminUserError);
        throw new Error(`Failed to create admin user record: ${adminUserError.message}`);
      }
      console.log('Admin user record created');
    } else {
      console.log('Admin user record already exists');
    }

    // Get or create vendor user
    let vendorAuthId;
    
    // Check if vendor auth user already exists
    const existingVendorAuth = existingAdminAuth.find(u => u.email === 'vendor@marina.com');
    
    if (existingVendorAuth) {
      console.log('Vendor auth already exists:', existingVendorAuth.id);
      vendorAuthId = existingVendorAuth.id;
    } else {
      // Create new vendor auth user
      const { data: vendorAuth, error: vendorAuthError } = await supabaseClient.auth.admin.createUser({
        email: 'vendor@marina.com',
        password: 'vendor123',
        email_confirm: true,
        user_metadata: { vendor_name: 'PT Marina Services' }
      });

      if (vendorAuthError) {
        console.error('Vendor auth error:', vendorAuthError);
        throw new Error(`Failed to create vendor auth: ${vendorAuthError.message}`);
      }

      console.log('Vendor auth created:', vendorAuth.user.id);
      vendorAuthId = vendorAuth.user.id;
    }

    // Check if vendor_users record already exists
    const { data: existingVendorUser } = await supabaseClient
      .from('vendor_users')
      .select('id')
      .eq('email', 'vendor@marina.com')
      .maybeSingle();

    if (!existingVendorUser) {
      // Generate UUID for vendor_id (sample vendor)
      const vendorId = crypto.randomUUID();
      
      const { error: vendorUserError } = await supabaseClient
        .from('vendor_users')
        .insert({
          vendor_id: vendorId,
          email: 'vendor@marina.com',
          auth_user_id: vendorAuthId,
          status: 'Active'
        });

      if (vendorUserError) {
        console.error('Vendor user error:', vendorUserError);
        throw new Error(`Failed to create vendor user record: ${vendorUserError.message}`);
      }
      console.log('Vendor user record created');
    } else {
      console.log('Vendor user record already exists');
    }

    console.log('Sample users created successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sample users created successfully',
        credentials: {
          admin: {
            email: 'admin@company.com',
            password: 'admin123'
          },
          vendor: {
            email: 'vendor@marina.com',
            password: 'vendor123'
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in setup-sample-users:', error);
    
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
