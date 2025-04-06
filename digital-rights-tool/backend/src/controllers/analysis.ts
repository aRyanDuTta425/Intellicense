import { HonoContext } from '../types';
import { analyzeLicensing } from '../lib/llm';
import { Analysis, Upload, KV_KEYS } from '../types';

// Helper function to convert ReadableStream to text
async function streamToText(stream: ReadableStream<Uint8Array>): Promise<string> {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
  let offset = 0;
  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder().decode(concatenated);
}

// Analyze content
export async function analyzeContent(c: HonoContext) {
  try {
    const { uploadId } = c.req.param();
    if (!uploadId) {
      return c.json({ message: 'Upload ID is required' }, 400);
    }

    // Mock analysis response
    const mockAnalysis = {
      id: crypto.randomUUID(),
      licensingInfo: JSON.stringify({
        licenseType: 'MIT',
        restrictions: ['None'],
        permissions: ['Commercial use', 'Modification', 'Distribution'],
        conditions: ['License and copyright notice'],
        compatibility: ['GPL-3.0', 'Apache-2.0'],
      }),
      licensingSummary: 'This content is licensed under the MIT License, which allows for commercial use, modification, and distribution with minimal restrictions.',
      riskScore: 10,  // Changed to match frontend's percentage-based scale
      createdAt: new Date().toISOString(),
      upload: {
        id: uploadId,
        fileName: 'example.txt',
        fileType: 'text/plain',
        fileUrl: 'https://example.com/example.txt',
        createdAt: new Date().toISOString()
      }
    };

    return c.json({ analysis: mockAnalysis });
  } catch (error) {
    console.error('Analysis error:', error);
    return c.json({ message: 'Analysis failed', error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
}

// Get analysis by ID
export async function getAnalysisById(c: HonoContext) {
  const id = c.req.param('id');
  
  // Mock analysis response
  const mockAnalysis = {
    id,
    licensingInfo: JSON.stringify({
      licenseType: 'MIT',
      restrictions: ['None'],
      permissions: ['Commercial use', 'Modification', 'Distribution'],
      conditions: ['License and copyright notice'],
      compatibility: ['GPL-3.0', 'Apache-2.0'],
    }),
    licensingSummary: 'This content is licensed under the MIT License, which allows for commercial use, modification, and distribution with minimal restrictions.',
    riskScore: 10,  // Changed to match frontend's percentage-based scale
    createdAt: new Date().toISOString(),
    upload: {
      id: 'mock-upload-1',
      fileName: 'example.txt',
      fileType: 'text/plain',
      fileUrl: 'https://example.com/example.txt',
      createdAt: new Date().toISOString()
    }
  };

  return c.json({ analysis: mockAnalysis });
}

// Get user analyses
export async function getUserAnalyses(c: HonoContext) {
  // Mock analyses response
  const mockAnalyses = [
    {
      id: 'mock-analysis-1',
      uploadId: 'mock-upload-1',
      licensingInfo: {
        licenseType: 'MIT',
        restrictions: ['None'],
        permissions: ['Commercial use', 'Modification', 'Distribution'],
        conditions: ['License and copyright notice'],
        compatibility: ['GPL-3.0', 'Apache-2.0'],
      },
      licensingSummary: 'This content is licensed under the MIT License, which allows for commercial use, modification, and distribution with minimal restrictions.',
      riskScore: 0.1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'mock-analysis-2',
      uploadId: 'mock-upload-2',
      licensingInfo: {
        licenseType: 'GPL-3.0',
        restrictions: ['Must disclose source'],
        permissions: ['Commercial use', 'Modification', 'Distribution'],
        conditions: ['License and copyright notice', 'State changes'],
        compatibility: ['MIT', 'Apache-2.0'],
      },
      licensingSummary: 'This content is licensed under the GPL-3.0 License, which requires that any derivative works must also be licensed under GPL-3.0.',
      riskScore: 0.3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return c.json(mockAnalyses);
}

// Delete analysis
export async function deleteAnalysis(c: HonoContext) {
  const id = c.req.param('id');
  
  // Mock successful deletion
  return c.json({ 
    message: 'Analysis deleted successfully',
    id 
  });
}
