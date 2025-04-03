module.exports = async (req, res) => {
  // Log the request details
  console.log('Request received:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body
  });

  // Handle root path
  if (req.url === '/') {
    return res.status(200).json({
      message: 'Digital Rights Tool API',
      status: 'running',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }

  // Handle health check
  if (req.url === '/health') {
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  }

  // Handle 404 for unknown routes
  return res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`,
    timestamp: new Date().toISOString()
  });
}; 