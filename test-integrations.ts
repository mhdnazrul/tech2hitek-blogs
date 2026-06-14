import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Load env vars
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'daj1w9589', // just a fallback
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function main() {
  console.log('--- Testing Supabase (Prisma) ---');
  try {
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: `test-${Date.now()}@example.com`,
      },
    });
    console.log('Successfully created user:', user.email);

    const fetchedUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    console.log('Successfully fetched user:', fetchedUser?.email);

    await prisma.user.delete({
      where: { id: user.id },
    });
    console.log('Successfully deleted user.');
    console.log('✅ Supabase Integration OK');
  } catch (error) {
    console.error('❌ Supabase Error:', error);
  }

  console.log('\n--- Testing Cloudinary ---');
  try {
    // Create a dummy image file
    const dummyImagePath = path.join(__dirname, 'dummy.txt');
    fs.writeFileSync(dummyImagePath, 'dummy content for upload');
    
    console.log('Attempting upload to Cloudinary...');
    const result = await cloudinary.uploader.upload(dummyImagePath, {
      resource_type: 'raw',
      folder: 'blog-web-tests',
    });
    console.log('Successfully uploaded! URL:', result.secure_url);
    
    // Clean up Cloudinary
    await cloudinary.uploader.destroy(result.public_id, { resource_type: 'raw' });
    console.log('Successfully deleted test file from Cloudinary.');
    console.log('✅ Cloudinary Integration OK');
    
    // Clean up local
    fs.unlinkSync(dummyImagePath);
  } catch (error) {
    console.error('❌ Cloudinary Error:', error);
  }

  await prisma.$disconnect();
}

main();
