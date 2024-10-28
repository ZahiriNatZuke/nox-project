import {
	HttpExceptionFilter,
	ZodValidationExceptionFilter,
} from '@app/core/filters';
import { env } from '@app/env';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ZodValidationPipe, patchNestJsSwagger } from 'nestjs-zod';
import { AppModule } from './app.module';

// Get the host
export const getHost = () => {
	if (env.ENVIRONMENT === 'production') return `https://${env.HOST}`;
	return `http://${env.HOST}:${env.PORT}`;
};

async function bootstrap() {
	// Get the global prefix and host
	const globalPrefix = 'api';
	const host = getHost();

	// Create the NestJS application
	const app = await NestFactory.create(AppModule);

	// Enable CORS
	app.enableCors({
		origin: env.ORIGINS,
		preflightContinue: true,
		// allowed headers
		allowedHeaders: [
			'Content-Type',
			'Origin',
			'X-Requested-With',
			'Accept',
			'Authorization',
		],
		// headers exposed to the client
		exposedHeaders: ['Authorization'],
		credentials: true, // Enable credentials (cookies, authorization headers) cross-origin
		optionsSuccessStatus: 204,
		maxAge: 86400, // 1 day
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
	});

	// Enable the shutdown hooks
	app.enableShutdownHooks();

	// Register the helmet plugin
	app.use(
		helmet({
			contentSecurityPolicy: {
				directives: {
					defaultSrc: ["'self'"],
					scriptSrc: ["'self'", "'unsafe-inline'"],
					styleSrc: ["'self'", "'unsafe-inline'"],
					imgSrc: ["'self'", 'data:'],
					fontSrc: ["'self'"],
				},
			},
			crossOriginEmbedderPolicy: { policy: 'require-corp' },
			crossOriginOpenerPolicy: { policy: 'same-origin' },
			crossOriginResourcePolicy: { policy: 'same-origin' },
			originAgentCluster: true,
			referrerPolicy: { policy: 'same-origin' },
			xContentTypeOptions: true,
			xDnsPrefetchControl: { allow: true },
			xDownloadOptions: true,
			xFrameOptions: { action: 'sameorigin' },
			xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
			xXssProtection: true,
			hidePoweredBy: true,
			strictTransportSecurity: {
				maxAge: 63072000, // 2 years
				includeSubDomains: true, // include all subdomains
				preload: true, // enable preload
			},
		})
	);

	// Register the validation pipe
	app.useGlobalPipes(new ZodValidationPipe());

	// Register the exception filters
	app.useGlobalFilters(new ZodValidationExceptionFilter());
	app.useGlobalFilters(new HttpExceptionFilter());

	// Set the global prefix
	app.setGlobalPrefix(globalPrefix);

	// Register the basic auth middleware for the Swagger documentation
	app.use(
		['/swagger', '/swagger-json'],
		require('express-basic-auth')({
			challenge: true,
			// this is the username and password used to authenticate
			users: { [env.SWAGGER_ADMIN_USERNAME]: env.SWAGGER_ADMIN_PASSWORD },
		})
	);

	// Register the Swagger documentation
	const options = new DocumentBuilder()
		.setTitle(env.APP_NAME)
		.setVersion(env.VERSION)
		.addServer(host)
		.build();

	// Patch the NestJS Swagger
	patchNestJsSwagger();

	// Create the Swagger document
	const appDocument = SwaggerModule.createDocument(app, options, {
		deepScanRoutes: true,
	});

	// Set up the Swagger module
	SwaggerModule.setup('/swagger', app, appDocument, {
		swaggerOptions: { persistAuthorization: true },
	});

	// Start the application
	await app.listen(env.PORT || 3000, '0.0.0.0', () =>
		Logger.log(
			`REST API at ${host}/${globalPrefix} & Swagger Doc at ${host}/swagger`
		)
	);
}
bootstrap();
