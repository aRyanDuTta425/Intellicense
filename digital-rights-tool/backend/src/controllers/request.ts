import { Context } from 'hono';
import { prisma } from '../index';
import { generateLegalAnswer } from '../lib/llm';
import { z } from 'zod';

// Define validation schema for legal questions
const questionSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  uploadId: z.string().optional(),
});

// Create a new legal question request
export const createRequest = async (c: Context) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Authentication required' }, 401);
    }

    const body = await c.req.json();
    
    // Validate request body
    const validation = questionSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ errors: validation.error.errors }, 400);
    }

    const { question, uploadId } = validation.data;

    // If uploadId is provided, verify it exists and belongs to the user
    let uploadInfo = null;
    if (uploadId) {
      const upload = await prisma.upload.findUnique({
        where: { id: uploadId },
        include: {
          analysis: true,
        },
      });

      if (!upload) {
        return c.json({ message: 'Upload not found' }, 404);
      }

      if (upload.userId !== user.id) {
        return c.json({ message: 'Not authorized to reference this upload' }, 403);
      }

      uploadInfo = {
        type: upload.fileType,
        name: upload.fileName,
        analysis: upload.analysis,
      };
    }

    // Generate answer using LLM
    const contentContext = uploadInfo ? 
      `File type: ${uploadInfo.type}, File name: ${uploadInfo.name}, ` +
      `Analysis: ${uploadInfo.analysis?.licensingSummary || 'No analysis available'}` 
      : undefined;
    
    const answer = await generateLegalAnswer(question, contentContext);

    // Create request record
    const request = await prisma.request.create({
      data: {
        userId: user.id,
        uploadId,
        question,
        answer,
      },
      include: {
        upload: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
          },
        },
      },
    });

    return c.json({
      message: 'Question submitted and answered',
      request,
    }, 201);
  } catch (error) {
    console.error('Error creating request:', error);
    return c.json({ message: 'Server error while processing your question' }, 500);
  }
};

// Get all requests for a user
export const getUserRequests = async (c: Context) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Authentication required' }, 401);
    }

    // Get all requests for the user
    const requests = await prisma.request.findMany({
      where: {
        userId: user.id,
      },
      include: {
        upload: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return c.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    return c.json({ message: 'Server error while fetching requests' }, 500);
  }
};

// Get request by ID
export const getRequestById = async (c: Context) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Authentication required' }, 401);
    }

    const id = c.req.param('id');

    // Check if this is a mock ID
    if (id.startsWith('mock-')) {
      // Return mock data for mock IDs
      const mockRequests = {
        'mock-1': {
          id: 'mock-1',
          userId: user.id,
          question: 'What are the fair use guidelines for using images in my educational blog?',
          answer: 'Fair use is a legal doctrine that allows limited use of copyrighted material without requiring permission from the rights holders. It\'s determined by four factors:\n1. Purpose and character of use (commercial vs. educational)\n2. Nature of the copyrighted work\n3. Amount and substantiality of the portion used\n4. Effect on the potential market\n\nIn your case, the use would likely be considered fair use if it\'s for educational purposes and doesn\'t significantly impact the market value of the original work.',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          upload: null
        },
        'mock-2': {
          id: 'mock-2',
          userId: user.id,
          question: 'Can I use Creative Commons licensed images for my commercial website?',
          answer: 'Creative Commons licenses provide a standardized way to grant permissions for using creative works. There are six main types:\n- CC BY: Attribution only\n- CC BY-SA: Attribution + Share Alike\n- CC BY-NC: Attribution + Non-Commercial\n- CC BY-ND: Attribution + No Derivatives\n- CC BY-NC-SA: Attribution + Non-Commercial + Share Alike\n- CC BY-NC-ND: Attribution + Non-Commercial + No Derivatives\n\nFor your commercial website, you should check the exact license terms to ensure compliance with the attribution and usage requirements.',
          createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          upload: null
        },
        'mock-3': {
          id: 'mock-3',
          userId: user.id,
          question: 'How do I determine if a work is in the public domain?',
          answer: 'Public domain works are not protected by copyright and can be freely used. Works enter the public domain through:\n1. Expiration of copyright term\n2. Failure to meet formal requirements\n3. Dedication by the copyright holder\n4. Works created by the U.S. government\n\nYou should verify the public domain status before using it freely.',
          createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          upload: null
        }
      };

      const mockRequest = mockRequests[id as keyof typeof mockRequests];
      if (mockRequest) {
        return c.json({ request: mockRequest });
      }
    }

    // Find the request
    const request = await prisma.request.findUnique({
      where: { id },
      include: {
        upload: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
          },
        },
      },
    });

    if (!request) {
      return c.json({ message: 'Request not found' }, 404);
    }

    // Check if user owns the request
    if (request.userId !== user.id) {
      return c.json({ message: 'Not authorized to access this request' }, 403);
    }

    return c.json({ request });
  } catch (error) {
    console.error('Error fetching request:', error);
    return c.json({ message: 'Server error while fetching request' }, 500);
  }
}; 