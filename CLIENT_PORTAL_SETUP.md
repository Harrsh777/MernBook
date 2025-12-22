# Client Project Portal - Setup Guide

A professional client project tracking portal built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Client Access**: Secure login with project code + password
- **Client Dashboard**: Read-only view of project status, payments, updates, and media
- **Admin Dashboard**: Full editing capabilities for all project data
- **Payment Tracking**: Visual circular progress chart
- **Media Gallery**: Image upload and viewing with modal
- **Real-time Updates**: Automatic data refresh

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Next.js project setup

## Installation

1. **Install Dependencies**

```bash
npm install bcryptjs @supabase/supabase-js framer-motion recharts
npm install -D @types/bcryptjs
```

2. **Set Up Supabase**

   - Create a new Supabase project
   - Run the SQL schema from `supabase-client-portal-schema.sql` in your Supabase SQL editor
   - Create a storage bucket named `client-media` with public access
   - Get your Supabase URL and keys

3. **Environment Variables**

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

4. **Create Storage Bucket**

In Supabase Dashboard:
- Go to Storage
- Create a new bucket named `client-media`
- Set it to public
- Configure CORS if needed

## Database Setup

1. Run the SQL schema in Supabase SQL Editor
2. Create a test client (you'll need to hash the password):

```sql
-- Example: Password is "test123"
-- Use bcrypt to hash: $2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq
INSERT INTO clients (project_code, password_hash, client_name, project_name, total_project_amount, amount_paid, project_status)
VALUES ('PROJ001', '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', 'John Doe', 'E-commerce Website', 50000.00, 25000.00, 'Development');
```

To hash passwords, you can use an online bcrypt generator or create a simple script.

## Usage

### Client Access

1. Navigate to `/client/login`
2. Enter project code and password
3. View dashboard at `/client/[projectCode]`

### Admin Access

1. Navigate to `/admin`
2. Enter admin password
3. Enter project code to load client data
4. Edit all project information, add updates, upload media

## Project Structure

```
app/
├── api/
│   ├── client/
│   │   ├── auth/route.ts          # Client authentication
│   │   └── [projectCode]/route.ts  # Client data fetching
│   └── admin/
│       ├── project/[projectCode]/route.ts  # Admin project management
│       ├── updates/route.ts        # Update CRUD operations
│       └── media/route.ts          # Media upload/delete
├── client/
│   ├── login/page.tsx              # Client login page
│   └── [projectCode]/page.tsx     # Client dashboard
├── admin/
│   └── page.tsx                    # Admin dashboard
└── components/
    ├── PaymentProgressChart.tsx   # Payment visualization
    ├── MediaGallery.tsx            # Image gallery with modal
    └── AdminDashboard.tsx         # Admin interface
```

## Security Notes

- Passwords are hashed using bcrypt
- Admin routes use service role key (server-side only)
- Client routes validate project code
- RLS policies are in place (though application-level filtering is used)

## Customization

- Update colors in Tailwind classes
- Modify status options in admin dashboard
- Adjust chart styling in `PaymentProgressChart.tsx`
- Customize media gallery layout

## Production Checklist

- [ ] Change admin password
- [ ] Set up proper authentication for admin routes
- [ ] Configure CORS for Supabase Storage
- [ ] Set up proper error logging
- [ ] Add rate limiting
- [ ] Configure SSL/TLS
- [ ] Set up monitoring
- [ ] Remove test data

## Support

For issues or questions, refer to the code comments or create an issue in the repository.

