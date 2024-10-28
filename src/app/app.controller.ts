import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('')
export class AppController {
	@Get('health-check')
	@ApiTags('Health Check')
	healthCheck(@Res() res: Response) {
		res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'service is up and running',
		});
	}
}
