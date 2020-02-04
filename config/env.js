const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// exports .env variables and sets default values for some fields
module.exports = {
	env: process.env.NODE_ENV,
	port: process.env.NODE_PORT,
	sslKeyPath: process.env.SSL_KEY_PATH,
	sslCertPath: process.env.SSL_CERT_PATH,
	db: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || '3306',
		dialect: process.env.DB_DIALECT || 'mysql',
		charset: process.env.DB_CHARSET || 'utf8mb4'
	},
	jwtSecret: process.env.JWT_SECRET,
	jwtAccessTokenTTL: process.env.JWT_ACCESS_TOKEN_TTL || '300d',
	aws: {
    config: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
      SESServiceURL: process.env.AWS_SES_SERVICE_URL,
      sendingAddress: process.env.AWS_SENDING_ADDRESS,
      maxSendRate: process.env.AWS_MAX_SEND_RATE || 1
    },
    s3: {
      images: {
        bucket: process.env.AWS_S3_IMAGE_BUCKET,
        urlPrefix: process.env.AWS_S3_IMAGE_PREFIX
      }
    }
  },
	root: path.join(__dirname, '/..')
}
