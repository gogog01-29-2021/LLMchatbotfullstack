// app.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();

// 라우트 import
const userRoutes = require('./server/src/routes/userRoutes');
const authRoutes = require('./server/src/routes/authRoutes');
const chatRoutes = require('./server/src/routes/chatRoutes');
const messageRoutes = require('./server/src/routes/messageRoutes');
const errorHandler = require('./server/src/middleware/errorHandler');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// Swagger 설정 - JWT 인증 스키마 제거
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'SeoulTech Chat API',
      version: '1.0.0',
      description: 'API for SeoulTech Chat Application',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./server/src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API 정보 페이지 (루트)
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SeoulTech Chat API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      docs: '/api-docs',
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      chatRooms: '/api/chat-rooms',
      messages: '/api/messages'
    },
    frontend: 'http://localhost:3001',
    note: 'React 앱은 http://localhost:3001에서 실행 중입니다.'
  });
});

// API 라우트 설정 - 인증 미들웨어 없이 직접 연결
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat-rooms', chatRoutes);
app.use('/api/messages', messageRoutes);

// 헬스 체크
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'SeoulTech Chat API'
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    suggestion: 'Try /api-docs for API documentation'
  });
});

// 에러 핸들러
app.use(errorHandler);

// 서버 시작 (직접 실행된 경우에만)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log('🚀=================================🚀');
    console.log(`   SeoulTech Chat API Server       `);
    console.log('🚀=================================🚀');
    console.log(`🌐 API Server: http://localhost:${PORT}`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
    console.log(`💊 Health Check: http://localhost:${PORT}/health`);
    console.log(`📱 React App: http://localhost:3001`);
    console.log('🚀=================================🚀');
  });
}

module.exports = app;