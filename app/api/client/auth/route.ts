import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const { projectCode, password } = await request.json();

        if (!projectCode || !password) {
            return NextResponse.json(
                { error: 'Project code and password are required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();
        
        // Fetch client by project code
        const { data: client, error } = await supabase
            .from('clients')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .single();

        if (error || !client) {
            return NextResponse.json(
                { error: 'Invalid project code or password' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, client.password_hash);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid project code or password' },
                { status: 401 }
            );
        }

        // Return success (session will be handled client-side)
        return NextResponse.json({
            success: true,
            projectCode: client.project_code,
            clientName: client.client_name,
        });
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'An error occurred during authentication' },
            { status: 500 }
        );
    }
}

