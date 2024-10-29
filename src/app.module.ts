import { AppController } from '@app/app.controller';
import { env } from '@app/env';
import { HttpStatus, Logger, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
	PrismaModule,
	QueryInfo,
	loggingMiddleware,
	providePrismaClientExceptionFilter,
} from 'nestjs-prisma';
import { ClientModule } from './app/features/client/client.module';

@Module({
	imports: [
		ThrottlerModule.forRoot([
			{
				ttl: env.RATE_LIMIT_WINDOWS,
				limit: env.RATE_LIMIT_MAX,
			},
		]),
		PrismaModule.forRoot({
			isGlobal: true,
			prismaServiceOptions: {
				prismaOptions: {
					log: [
						{ emit: 'stdout', level: 'query' },
						{ emit: 'stdout', level: 'info' },
						{ emit: 'stdout', level: 'warn' },
						{ emit: 'stdout', level: 'error' },
					],
				},
				middlewares: [
					loggingMiddleware({
						logger: new Logger('PrismaMiddleware'),
						logLevel: 'log', // default is `debug`
						logMessage: (query: QueryInfo) =>
							`[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
					}),
				],
			},
		}),
		ClientModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		providePrismaClientExceptionFilter({
			// Prisma Error Code: HTTP Status Response
			P2000: HttpStatus.BAD_REQUEST,
			P2001: HttpStatus.NOT_FOUND,
			P2002: HttpStatus.CONFLICT,
			P2003: HttpStatus.BAD_REQUEST,
			P2025: HttpStatus.NOT_FOUND,
		}),
	],
})
export class AppModule {}
