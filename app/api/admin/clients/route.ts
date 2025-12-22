import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// GET - Fetch all clients/projects
export async function GET() {
    try {
        const supabase = createServerClient();

        const { data: clients, error } = await supabase
            .from('clients')
            .select('id, project_code, client_name, project_name, project_status, total_project_amount, amount_paid, created_at')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error fetching clients:', error);
            return NextResponse.json(
                { error: error.message || 'Failed to fetch clients' },
                { status: 400 }
            );
        }

        console.log(`Fetched ${clients?.length || 0} clients`);
        return NextResponse.json({ clients: clients || [] });
    } catch (error) {
        console.error('Error fetching clients:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching clients';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

