const express = require('express');
const path = require('path');
const LUObfuscator = require('./index');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static('public'));

// HTML 페이지 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * API: 코드 난독화
 * POST /api/obfuscate
 */
app.post('/api/obfuscate', (req, res) => {
  try {
    const { code, options } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const obfuscator = new LUObfuscator({
      mangleVars: options?.mangleVars !== false,
      mangleFunctions: options?.mangleFunctions !== false,
      encryptStrings: options?.encryptStrings || false,
      compact: options?.compact || false
    });

    const obfuscatedCode = obfuscator.obfuscate(code);

    res.json({
      success: true,
      originalCode: code,
      obfuscatedCode: obfuscatedCode,
      originalSize: code.length,
      obfuscatedSize: obfuscatedCode.length,
      reduction: ((1 - obfuscatedCode.length / code.length) * 100).toFixed(2) + '%'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * API: 건강 체크
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'LU Obfuscator API'
  });
});

/**
 * API: 버전 정보
 */
app.get('/api/version', (req, res) => {
  res.json({
    name: 'LU Obfuscator',
    version: '1.0.0',
    description: 'A powerful code obfuscator'
  });
});

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║    🔒 LU Obfuscator Server Started     ║
║                                        ║
║  Server: http://localhost:${PORT}           ║
║  API: http://localhost:${PORT}/api          ║
║  Health: http://localhost:${PORT}/api/health║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
