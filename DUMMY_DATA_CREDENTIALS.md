# Dummy Data Credentials

## Client Login Credentials

### Client 1: E-commerce Website
- **Project Code:** `PROJ001`
- **Password:** `client123`
- **Client Name:** John Smith
- **Project:** E-commerce Website Development
- **Status:** Development
- **Total Amount:** $75,000
- **Amount Paid:** $37,500 (50%)

### Client 2: Mobile App
- **Project Code:** `PROJ002`
- **Password:** `password123`
- **Client Name:** Sarah Johnson
- **Project:** Fitness Tracking Mobile App
- **Status:** Testing
- **Total Amount:** $95,000
- **Amount Paid:** $47,500 (50%)

## Admin Dashboard
- **Password:** `admin123` (or set `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`)

## Test Data Summary

Each client has:
- ✅ 2 project updates with descriptions and links
- ✅ 2 media/images (using placeholder Unsplash URLs)

## Important Notes

1. **Image URLs:** The dummy data uses placeholder Unsplash image URLs. In production:
   - Upload actual images to Supabase Storage bucket `client-media`
   - Replace the placeholder URLs with actual Supabase Storage URLs

2. **Password Hashes:** The passwords are already hashed in the SQL file. If you need to create new hashes:
   ```bash
   node scripts/hash-password.js yourpassword
   ```

3. **Storage Bucket:** Make sure to create the `client-media` storage bucket in Supabase Dashboard:
   - Go to Storage
   - Create new bucket named `client-media`
   - Set it to public
   - Configure CORS if needed

## Quick Test Steps

1. Run the SQL file in Supabase SQL Editor
2. Go to `/client/login` and test with PROJ001/client123
3. Go to `/admin` and test with admin123
4. Load PROJ001 or PROJ002 in admin dashboard
5. Try uploading an image (will need actual storage bucket setup)

