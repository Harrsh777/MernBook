import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// POST - Create update
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('client_updates')
            .insert({
                project_code: body.projectCode.toUpperCase(),
                title: body.title,
                description: body.description,
                links: body.links || [],
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, update: data });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}

// PUT - Update update
export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('client_updates')
            .update({
                title: body.title,
                description: body.description,
                links: body.links || [],
            })
            .eq('id', body.id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, update: data });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}

// DELETE - Delete update
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Update ID is required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        const { error } = await supabase
            .from('client_updates')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}

