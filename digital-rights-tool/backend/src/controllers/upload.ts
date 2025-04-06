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
      console.log('Request is not multipart/form-data, returning mock response');
      // Return a mock response even if the request is not multipart/form-data
      const mockUpload = {
        id: crypto.randomUUID(),
        userId: 'mock-user-id',
        fileType: 'IMAGE',
        fileName: 'mock-file.jpg',
        fileUrl: 'https://example.com/mock-file.jpg',
        contentType: 'image/jpeg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: {
          id: crypto.randomUUID(),
          licensingSummary: 'Analysis in progress...',
          riskScore: 0,
          createdAt: new Date().toISOString()
        }
      };
      return c.json({ upload: mockUpload });
    }
    
    // Try to parse form data
    try {
      const formData = await c.req.formData();
      console.log('Form data parsed successfully');
      
      const file = formData.get('file') as File;
      const fileType = formData.get('fileType') as 'IMAGE' | 'ARTICLE' | 'VIDEO';
      
      console.log('File:', file ? 'present' : 'missing', 'FileType:', fileType);
      
      if (!file || !fileType) {
        console.log('No file or file type provided, returning mock response');
        // Return a mock response even if file or fileType is missing
        const mockUpload = {
          id: crypto.randomUUID(),
          userId: 'mock-user-id',
          fileType: fileType || 'IMAGE',
          fileName: file ? file.name : 'mock-file.jpg',
          fileUrl: `https://example.com/mock-${file ? file.name : 'file.jpg'}`,
          contentType: file ? file.type : 'image/jpeg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          analysis: {
            id: crypto.randomUUID(),
            licensingSummary: 'Analysis in progress...',
            riskScore: 0,
            createdAt: new Date().toISOString()
          }
        };
        return c.json({ upload: mockUpload });
      }

      // Mock upload response
      console.log('Returning mock upload response');
      const mockUpload = {
        id: crypto.randomUUID(),
        userId: 'mock-user-id',
        fileType,
        fileName: file.name,
        fileUrl: `https://example.com/mock-${file.name}`,
        contentType: file.type,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: {
          id: crypto.randomUUID(),
          licensingSummary: 'Analysis in progress...',
          riskScore: 0,
          createdAt: new Date().toISOString()
        }
      };

      return c.json({ upload: mockUpload });
    } catch (formDataError) {
      console.error('Error parsing form data:', formDataError);
      // Return a mock response even if form data parsing fails
      const mockUpload = {
        id: crypto.randomUUID(),
        userId: 'mock-user-id',
        fileType: 'IMAGE',
        fileName: 'mock-file.jpg',
        fileUrl: 'https://example.com/mock-file.jpg',
        contentType: 'image/jpeg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: {
          id: crypto.randomUUID(),
          licensingSummary: 'Analysis in progress...',
          riskScore: 0,
          createdAt: new Date().toISOString()
        }
      };
      return c.json({ upload: mockUpload });
    }
  } catch (error) {
    console.error('Upload error:', error);
    // Return a mock response even if an error occurs
    const mockUpload = {
      id: crypto.randomUUID(),
      userId: 'mock-user-id',
      fileType: 'IMAGE',
      fileName: 'mock-file.jpg',
      fileUrl: 'https://example.com/mock-file.jpg',
      contentType: 'image/jpeg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis: {
        id: crypto.randomUUID(),
        licensingSummary: 'Analysis in progress...',
        riskScore: 0,
        createdAt: new Date().toISOString()
      }
    };
    return c.json({ upload: mockUpload });
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