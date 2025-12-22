import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// POST - Upload media
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const projectCode = formData.get('projectCode') as string;
        const imageName = formData.get('imageName') as string;

        if (!file || !projectCode) {
            return NextResponse.json(
                { error: 'File and project code are required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectCode}/${Date.now()}.${fileExt}`;
        const filePath = `client-media/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('client-media')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json(
                { error: uploadError.message },
                { status: 400 }
            );
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from('client-media').getPublicUrl(filePath);

        // Save to database
        const { data: mediaData, error: dbError } = await supabase
            .from('client_media')
            .insert({
                project_code: projectCode.toUpperCase(),
                image_url: publicUrl,
                image_name: imageName || file.name,
            })
            .select()
            .single();

        if (dbError) {
            return NextResponse.json({ error: dbError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, media: mediaData });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'An error occurred' },
            { status: 500 }
        );
    }
}

// DELETE - Delete media
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const imageUrl = searchParams.get('imageUrl');

        if (!id) {
            return NextResponse.json(
                { error: 'Media ID is required' },
                { status: 400 }
            );
        }

        const supabase = createServerClient();

        // Delete from storage if URL provided
        if (imageUrl) {
            const urlParts = imageUrl.split('/client-media/');
            if (urlParts.length > 1) {
                const filePath = `client-media/${urlParts[1]}`;
                await supabase.storage.from('client-media').remove([filePath]);
            }
        }

        // Delete from database
        const { error } = await supabase
            .from('client_media')
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

