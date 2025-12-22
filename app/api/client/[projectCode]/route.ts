import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ projectCode: string }> }
) {
    try {
        const { projectCode } = await params;

        if (!projectCode) {
            return NextResponse.json(
                { error: 'Project code is required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Fetch client data
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .single();

        if (clientError || !client) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        // Fetch updates
        const { data: updates } = await supabase
            .from('client_updates')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .order('created_at', { ascending: false });

        // Fetch media
        const { data: media } = await supabase
            .from('client_media')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .order('uploaded_at', { ascending: false });

        return NextResponse.json({
            client: {
                id: client.id,
                projectCode: client.project_code,
                clientName: client.client_name,
                projectName: client.project_name,
                totalProjectAmount: client.total_project_amount,
                amountPaid: client.amount_paid,
                projectStatus: client.project_status,
                createdAt: client.created_at,
            },
            updates: updates || [],
            media: media || [],
        });
    } catch (error) {
        console.error('Error fetching client data:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching data' },
            { status: 500 }
        );
    }
}

