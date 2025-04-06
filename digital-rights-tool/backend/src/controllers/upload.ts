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
    console.log('Upload request received');
    
    // Check if the request has form data
    const contentType = c.req.header('Content-Type') || '';
    console.log('Content-Type:', contentType);
    
    if (!contentType.includes('multipart/form-data')) {
      console.error('Invalid content type:', contentType);
      return c.json({
        error: 'Invalid request',
        message: 'Content-Type must be multipart/form-data'
      }, 400);
    }
    
    // Try to parse form data
    try {
      const formData = await c.req.formData();
      console.log('Form data parsed successfully');
      
      const file = formData.get('file') as File;
      const fileType = formData.get('fileType') as 'IMAGE' | 'ARTICLE' | 'VIDEO';
      
      console.log('File:', file ? 'present' : 'missing', 'FileType:', fileType);
      
      if (!file || !fileType) {
        console.error('Missing required fields');
        return c.json({
          error: 'Invalid request',
          message: 'File and fileType are required'
        }, 400);
      }

      // Create mock upload response
      const mockUpload = {
        id: crypto.randomUUID(),
        userId: 'mock-user-id',
        fileType,
        fileName: file.name,
        fileUrl: `https://example.com/mock-${file.name}`,
        contentType: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return c.json({ upload: mockUpload });
    } catch (formDataError) {
      console.error('Error parsing form data:', formDataError);
      return c.json({
        error: 'Invalid request',
        message: 'Error parsing form data'
      }, 400);
    }
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({
      error: 'Server error',
      message: 'An error occurred while processing the upload'
    }, 500);
  }
}

// Get user uploads
export async function getUploads(c: HonoContext) {
  // Mock uploads response
  const mockUploads = [
    {
      id: 'mock-upload-1',
      userId: 'mock-user-id',
      fileType: 'IMAGE',
      fileName: 'sample-image.jpg',
      fileUrl: 'https://example.com/sample-image.jpg',
      contentType: 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis: {
        id: 'mock-analysis-1',
        licensingSummary: 'This content is licensed under the MIT License, which allows for commercial use, modification, and distribution with minimal restrictions.',
        riskScore: 10,
        createdAt: new Date().toISOString()
      }
    },
    {
      id: 'mock-upload-2',
      userId: 'mock-user-id',
      fileType: 'ARTICLE',
      fileName: 'sample-article.txt',
      fileUrl: 'https://example.com/sample-article.txt',
      contentType: 'text/plain',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis: {
        id: 'mock-analysis-2',
        licensingSummary: 'This content is licensed under the GPL-3.0 License, which requires that any derivative works must also be licensed under GPL-3.0.',
        riskScore: 30,
        createdAt: new Date().toISOString()
      }
    }
  ];

  return c.json({ uploads: mockUploads });
}

// Get upload by ID
export async function getUploadById(c: HonoContext) {
  const id = c.req.param('id');
  
  // Mock single upload response
  const mockUpload = {
    id,
    userId: 'mock-user-id',
    fileType: 'IMAGE',
    fileName: 'sample-image.jpg',
    fileUrl: 'https://example.com/sample-image.jpg',
    contentType: 'image/jpeg',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    analysis: {
      id: 'mock-analysis-1',
      licensingSummary: 'This content is licensed under the MIT License, which allows for commercial use, modification, and distribution with minimal restrictions.',
      riskScore: 10,
      createdAt: new Date().toISOString()
    }
  };

  return c.json({ upload: mockUpload });
}

// Delete upload
export async function deleteUpload(c: HonoContext) {
  const id = c.req.param('id');
  
  // Mock successful deletion
  return c.json({ 
    message: 'Upload deleted successfully',
    id 
  });
} 