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
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { uploadId } = c.req.param();
    if (!uploadId) {
      return c.json({ message: 'Upload ID is required' }, 400);
    }

    console.log('Getting upload:', uploadId);
    // Get upload
    const upload = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_BY_ID(uploadId));
    console.log('Upload data:', upload);
    if (!upload) {
      return c.json({ message: 'Upload not found' }, 404);
    }

    const uploadData = JSON.parse(upload) as Upload;
    console.log('Parsed upload data:', uploadData);
    if (uploadData.userId !== user.id) {
      return c.json({ message: 'Not authorized to analyze this upload' }, 403);
    }

    // Get file from R2
    console.log('Getting file from R2:', uploadData.fileUrl);
    const file = await c.env.UPLOADS.get(uploadData.fileUrl);
    console.log('File found:', !!file);
    if (!file) {
      return c.json({ message: 'File not found in storage' }, 404);
    }

    // Convert file to text
    console.log('Converting file to text');
    const response = new Response(file.body);
    const buffer = await response.arrayBuffer();
    const text = new TextDecoder().decode(buffer);
    console.log('File content:', text.substring(0, 100));

    // Analyze content
    console.log('Analyzing content');
    const { licensingInfo, licensingSummary, riskScore } = await analyzeLicensing(text);
    console.log('Analysis result:', { licensingInfo, licensingSummary, riskScore });

    // Create analysis
    const analysis: Analysis = {
      id: crypto.randomUUID(),
      uploadId: uploadData.id,
      licensingInfo,
      licensingSummary,
      riskScore,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Store analysis in KV
    console.log('Storing analysis:', analysis.id);
    await c.env.ANALYSES.put(KV_KEYS.ANALYSIS_BY_ID(analysis.id), JSON.stringify(analysis));

    // Add analysis ID to upload's analyses list
    console.log('Updating upload analyses list');
    const uploadAnalyses = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_ANALYSES(uploadData.id));
    const analyses = uploadAnalyses ? JSON.parse(uploadAnalyses) : [];
    analyses.push(analysis.id);
    await c.env.ANALYSES.put(KV_KEYS.UPLOAD_ANALYSES(uploadData.id), JSON.stringify(analyses));

    return c.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return c.json({ message: 'Analysis failed', error: error instanceof Error ? error.message : 'Unknown error' }, 500);
  }
}

// Get analysis by ID
export async function getAnalysisById(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    
    const analysis = await c.env.ANALYSES.get(KV_KEYS.ANALYSIS_BY_ID(id));
    if (!analysis) {
      return c.json({ message: 'Analysis not found' }, 404);
    }

    const analysisData = JSON.parse(analysis) as Analysis;
    
    // Get upload to check ownership
    const upload = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_BY_ID(analysisData.uploadId));
    if (!upload) {
      return c.json({ message: 'Upload not found' }, 404);
    }

    const uploadData = JSON.parse(upload) as Upload;
    if (uploadData.userId !== user.id) {
      return c.json({ message: 'Not authorized to access this analysis' }, 403);
    }

    return c.json(analysisData);
  } catch (error) {
    console.error('Get analysis error:', error);
    return c.json({ message: 'Failed to get analysis' }, 500);
  }
}

// Get all analyses for user
export async function getUserAnalyses(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    // Get user's uploads
    const userUploads = await c.env.ANALYSES.get(KV_KEYS.USER_UPLOADS(user.id));
    if (!userUploads) {
      return c.json([]);
    }

    const uploadIds = JSON.parse(userUploads);
    
    // Get all analyses for user's uploads
    const analysesPromises = uploadIds.map(async (uploadId: string) => {
      const uploadAnalyses = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_ANALYSES(uploadId));
      if (!uploadAnalyses) return [];
      
      const analysisIds = JSON.parse(uploadAnalyses);
      const analysisPromises = analysisIds.map(async (analysisId: string) => {
        const analysis = await c.env.ANALYSES.get(KV_KEYS.ANALYSIS_BY_ID(analysisId));
        return analysis ? JSON.parse(analysis) : null;
      });
      
      return Promise.all(analysisPromises);
    });

    const analysesArrays = await Promise.all(analysesPromises);
    const analyses = analysesArrays.flat().filter(Boolean);

    return c.json(analyses);
  } catch (error) {
    console.error('Get analyses error:', error);
    return c.json({ message: 'Failed to get analyses' }, 500);
  }
}

// Delete analysis
export async function deleteAnalysis(c: HonoContext) {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ message: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    
    const analysis = await c.env.ANALYSES.get(KV_KEYS.ANALYSIS_BY_ID(id));
    if (!analysis) {
      return c.json({ message: 'Analysis not found' }, 404);
    }

    const analysisData = JSON.parse(analysis) as Analysis;
    
    // Get upload to check ownership
    const upload = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_BY_ID(analysisData.uploadId));
    if (!upload) {
      return c.json({ message: 'Upload not found' }, 404);
    }

    const uploadData = JSON.parse(upload) as Upload;
    if (uploadData.userId !== user.id) {
      return c.json({ message: 'Not authorized to delete this analysis' }, 403);
    }

    // Delete analysis from KV
    await c.env.ANALYSES.delete(KV_KEYS.ANALYSIS_BY_ID(id));
    
    // Remove analysis ID from upload's analyses list
    const uploadAnalyses = await c.env.ANALYSES.get(KV_KEYS.UPLOAD_ANALYSES(analysisData.uploadId));
    if (uploadAnalyses) {
      const analyses = JSON.parse(uploadAnalyses);
      const updatedAnalyses = analyses.filter((analysisId: string) => analysisId !== id);
      await c.env.ANALYSES.put(KV_KEYS.UPLOAD_ANALYSES(analysisData.uploadId), JSON.stringify(updatedAnalyses));
    }

    return c.json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    return c.json({ message: 'Failed to delete analysis' }, 500);
  }
}
