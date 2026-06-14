# Setup Instructions

## PowerShell Execution Policy Issue

Since npm is blocked by PowerShell execution policy, you need to enable script execution or use an alternative method.

### Option 1: Enable PowerShell Script Execution (Recommended)

Run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then run:
```powershell
cd c:\Users\mhd\Desktop\repos\blog-web
npm install
```

### Option 2: Use Command Prompt (cmd)

Open Command Prompt instead of PowerShell and run:

```cmd
cd c:\Users\mhd\Desktop\repos\blog-web
npm install
```

### Option 3: Use Git Bash

If you have Git installed, use Git Bash:

```bash
cd /c/Users/mhd/Desktop/repos/blog-web
npm install
```

## After Installing Dependencies

1. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your values:
   - `DATABASE_URL`: Your PostgreSQL connection string (Neon or Supabase recommended)
   - `NEXTAUTH_SECRET`: Generate a random string: `openssl rand -base64 32`
   - `NEXTAUTH_URL`: `http://localhost:3000`
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NEXT_PUBLIC_APP_URL`: `http://localhost:3000`

2. **Run database migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## Database Setup

### Using Neon (Recommended for Free Tier)

1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Paste it in your `.env` file as `DATABASE_URL`

### Using Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string
6. Paste it in your `.env` file as `DATABASE_URL`

## Cloudinary Setup

1. Go to [cloudinary.com](https://cloudinary.com)
2. Create a free account
3. Go to Dashboard > Account Details
4. Copy:
   - Cloud name
   - API Key
   - API Secret
5. Add these to your `.env` file

## Next Steps

After setup:

1. Create an admin user (you'll need to add this manually to the database or implement a signup flow)
2. Access the admin panel at `/admin/login`
3. Create your first blog post
4. Customize the design to match your Figma file

## Troubleshooting

If you encounter issues:

1. Make sure all dependencies are installed: `npm install`
2. Check that `.env` file exists and is properly configured
3. Verify database connection string is correct
4. Run `npx prisma studio` to inspect your database
5. Check the console for any error messages
