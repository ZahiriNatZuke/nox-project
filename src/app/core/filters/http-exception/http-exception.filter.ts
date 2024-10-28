import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status = exception.getStatus();
		const exceptionResponse = exception.getResponse();

		const error =
			typeof response === 'string'
				? { message: exceptionResponse }
				: (exceptionResponse as object);

		response.status(status).send({
			statusCode: status,
			status: 'error',
			...error,
			timestamp: new Date().toISOString(),
		});
	}
}
