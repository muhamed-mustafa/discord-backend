import 'module-alias/register.js';
import colors from 'colors';
import express, { json, urlencoded } from 'express';
import http from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToDatabase } from '@root/config/db.js';
import { globalError } from '@root/middlewares/error.js';
import { readFileSync } from 'fs';
import { RouteManager } from './index.js';
import { ErrorResponse } from '@root/utils/errorResponse.js';
import { SocketServer } from './socketServer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Application {
  constructor() {
    this.app = express();
    this.server;
  }

  corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  };

  rateLimitOptions = {
    windowMs: 60 * 60 * 1000,
    max: 100,
    message:
      'Too many accounts created from this IP, please try again after an hour',
  };

  async start() {
    dotenv.config({ path: './.env' });
    connectToDatabase();
    this.i18nConfiguration();
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.initializeRoutes(this.app);
    this.globalErrorHandler(this.app);
    this.startServer();
    this.handleUnhandledRejection();
  }

  i18nConfiguration() {
    app.use((req, _res, next) => {
      console.log('req', req.headers.lang);
      i18n.setLocale(req.headers['lang']?.toString() || 'ar');
      console.log('req', req.headers.lang);
      return next();
    });

    const messagesPath = path.join(__dirname, 'translations', 'messages.json');

    const translations = JSON.parse(readFileSync(messagesPath, 'utf8'));

    const warnMissingTranslation = (locale, key) => {
      console.warn(
        `Translation missing for key '${key}' in locale '${locale}'.`
      );

      return key;
    };

    i18n.configure({
      locales: ['en', 'ar'],
      directory: path.join(__dirname, 'translations'),
      defaultLocale: 'ar',
      objectNotation: true,
      updateFiles: false,
      syncFiles: false,
      queryParameter: 'lang',
    });

    i18n.__ = (phrase) => {
      const translation = translations[phrase][i18n.getLocale()];
      return typeof translation === 'undefined'
        ? warnMissingTranslation(i18n.getLocale(), phrase)
        : translation;
    };
  }

  securityMiddleware(app) {
    app.use(cookieParser());
    app.use(hpp());
    app.use(helmet());
    app.use(xss());
    app.use(mongoSanitize());
    app.use(cors(this.corsOptions));
    app.use(rateLimit(this.rateLimitOptions));
  }

  standardMiddleware(app) {
    app.use(express.json());
    app.use(compression());
    app.use(fileUpload());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }
  }

  globalErrorHandler(app) {
    app.all('*', (req, _res, next) => {
      next(
        new ErrorResponse(`Can't find this route : ${req.originalUrl}`, 400)
      );
    });
    app.use(globalError);
  }

  initializeRoutes(app) {
    new RouteManager(app).mountRoutes();
  }

  startServer() {
    this.server = http.createServer(this.app).listen(process.env.PORT, () => {
      console.log(`Server Is Running On Port ${process.env.PORT}`.bgMagenta);
    });

    this.startServer = new SocketServer(this.server);
  }

  handleUnhandledRejection() {
    process.on('unhandledRejection', (err) => {
      console.error(`Error: ${err.message}`.red);
      this.server.close(() => process.exit(1));
    });
  }
}

const { app } = new Application();

export { app };
