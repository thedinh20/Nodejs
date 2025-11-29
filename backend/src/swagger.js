// swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const PORT = process.env.PORT || 5001;

const options = {
    // Định nghĩa OpenAPI (Swagger) cơ bản
    definition: {
        openapi: '3.0.0', // Phiên bản OpenAPI
        info: {
            title: 'API Tài Liệu cho Ứng dụng Express', // Tiêu đề tài liệu
            version: '1.0.0', // Phiên bản API
            description: 'Đây là tài liệu API được tạo tự động bằng Swagger/OpenAPI cho Node.js Express.',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api`, // URL cơ sở cho API
                description: 'Máy chủ Phát triển',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },
    // Đường dẫn đến các tệp chứa các chú thích JSDoc
    apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;