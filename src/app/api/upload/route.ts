import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename in webp format
    const timestamp = Date.now();
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `upload_${timestamp}_${cleanName}.webp`;
    
    // Save to frontend public uploads
    const frontendUploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(frontendUploadDir)) {
      fs.mkdirSync(frontendUploadDir, { recursive: true });
    }
    const frontendFilePath = path.join(frontendUploadDir, filename);
    await writeFile(frontendFilePath, buffer);

    // Also sync to backend uploads
    const backendUploadDir = path.join(process.cwd(), '..', 'backend', 'uploads');
    if (!fs.existsSync(backendUploadDir)) {
      fs.mkdirSync(backendUploadDir, { recursive: true });
    }
    const backendFilePath = path.join(backendUploadDir, filename);
    try {
      await writeFile(backendFilePath, buffer);
    } catch {}

    const publicUrl = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      message: 'Photo uploaded successfully.',
    });
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'File upload failed.' },
      { status: 500 }
    );
  }
}
