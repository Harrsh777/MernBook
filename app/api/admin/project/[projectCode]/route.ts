import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// GET - Fetch project data for admin
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

        console.log('Fetching project:', projectCode);

        const supabase = createServerClient();

        const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .single();

        if (clientError) {
            console.error('Error fetching client:', clientError);
            return NextResponse.json(
                { error: clientError.message || 'Project not found' },
                { status: 404 }
            );
        }

        if (!client) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            );
        }

        const { data: updates, error: updatesError } = await supabase
            .from('client_updates')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .order('created_at', { ascending: false });

        if (updatesError) {
            console.error('Error fetching updates:', updatesError);
        }

        const { data: media, error: mediaError } = await supabase
            .from('client_media')
            .select('*')
            .eq('project_code', projectCode.toUpperCase())
            .order('uploaded_at', { ascending: false });

        if (mediaError) {
            console.error('Error fetching media:', mediaError);
        }

        return NextResponse.json({
            client,
            updates: updates || [],
            media: media || [],
        });
    } catch (error) {
        console.error('Error in GET project:', error);
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching project data';
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

// PUT - Update project data
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ projectCode: string }> }
) {
    try {
        const { projectCode } = await params;
        const body = await request.json();
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('clients')
            .update({
                client_name: body.clientName,
                project_name: body.projectName,
                total_project_amount: body.totalProjectAmount,
                amount_paid: body.amountPaid,
                project_status: body.projectStatus,
            })
            .eq('project_code', projectCode.toUpperCase())
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, client: data });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}

