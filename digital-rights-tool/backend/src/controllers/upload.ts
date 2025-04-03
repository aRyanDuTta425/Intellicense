import { z } from 'zod';
import { HonoContext } from '../types';
import { R2PutOptions } from '@cloudflare/workers-types';
import { Upload, KV_KEYS } from '../types';

// Define validation schema for upload
const uploadSchema = z.object({
  fileType: z.enum(['IMAGE', 'ARTICLE', 'VIDEO']),
  contentType: z.string().optional(),
});

// Upload file
export async function uploadFile(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as 'IMAGE' | 'ARTICLE' | 'VIDEO';
    
    if (!file || !fileType) {
      return c.json({ message: 'No file or file type provided' }, 400);
    }

    const buffer = await file.arrayBuffer();
    const fileUrl = `${Date.now()}-${file.name}`;
    
    const options: R2PutOptions = {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        originalName: file.name,
        type: file.type,
      },
    };
    
    await c.env.UPLOADS.put(fileUrl, buffer, options);

    const upload: Upload = {
      id: crypto.randomUUID(),
      userId: user.id,
      fileType,
      fileName: file.name,
      fileUrl,
      contentType: file.type,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store upload metadata in KV
    await c.env.ANALYSES.put(KV_KEYS.UPLOAD_BY_ID(upload.id), JSON.stringify(upload));
    
    // Add upload ID to user's uploads list
    const userUploads = await c.env.ANALYSES.get(KV_KEYS.USER_UPLOADS(user.id));
    const uploads = userUploads ? JSON.parse(userUploads) : [];
    uploads.push(upload.id);
    await c.env.ANALYSES.put(KV_KEYS.USER_UPLOADS(user.id), JSON.stringify(uploads));

    return c.json(upload);
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ message: 'Upload failed' }, 500);
  }
}

// Get user uploads
export async function getUploads(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const userUploads = await c.env.ANALYSES.get(KV_KEYS.USER_UPLOADS(user.id));
    if (!userUploads) {
      return c.json([]);
    }

    const uploadIds = JSON.parse(userUploads);
    const uploads = await Promise.all(
      uploadIds.map(async (id: string) => {
        const upload = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_BY_ID(id));
        return upload ? JSON.parse(upload) : null;
      })
    );

    return c.json(uploads.filter(Boolean));
  } catch (error) {
    console.error('Get uploads error:', error);
    return c.json({ message: 'Failed to get uploads' }, 500);
  }
}

// Get upload by ID
export async function getUploadById(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    
    const upload = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_BY_ID(id));
    if (!upload) {
      return c.json({ message: 'Upload not found' }, 404);
    }

    const uploadData = JSON.parse(upload) as Upload;
    if (uploadData.userId !== user.id) {
      return c.json({ message: 'Not authorized to access this upload' }, 403);
    }

    const object = await c.env.UPLOADS.get(uploadData.fileUrl);
    if (!object) {
      return c.json({ message: 'File not found' }, 404);
    }

    return new Response(object.body, {
      headers: {
        'Content-Type': uploadData.contentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${uploadData.fileName}"`,
      },
    });
  } catch (error) {
    console.error('Get upload error:', error);
    return c.json({ message: 'Failed to get upload' }, 500);
  }
}

// Delete upload by ID
export async function deleteUpload(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }
    
    const { id } = c.req.param();
    
    const upload = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_BY_ID(id));
    if (!upload) {
      return c.json({ message: 'Upload not found' }, 404);
    }

    const uploadData = JSON.parse(upload) as Upload;
    if (uploadData.userId !== user.id) {
      return c.json({ message: 'Not authorized to delete this upload' }, 403);
    }
    
    // Delete file from R2
    await c.env.UPLOADS.delete(uploadData.fileUrl);
    
    // Delete upload metadata from KV
    await c.env.ANALYSES.delete(KV_KEYS.UPLOAD_BY_ID(id));
    
    // Remove upload ID from user's uploads list
    const userUploads = await c.env.ANALYSES.get(KV_KEYS.USER_UPLOADS(user.id));
    if (userUploads) {
      const uploads = JSON.parse(userUploads);
      const updatedUploads = uploads.filter((uploadId: string) => uploadId !== id);
      await c.env.ANALYSES.put(KV_KEYS.USER_UPLOADS(user.id), JSON.stringify(updatedUploads));
    }
    
    return c.json({ message: 'Upload deleted successfully' });
  } catch (error) {
    console.error('Error deleting upload:', error);
    return c.json({ message: 'Server error while deleting upload' }, 500);
  }
} 