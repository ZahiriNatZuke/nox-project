import { Pagination } from '@app/core/types';
import {
	ExecutionContext,
	applyDecorators,
	createParamDecorator,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

export const PaginationDecorator = createParamDecorator(
	(_, ctx: ExecutionContext): Pagination => {
		const req: Request & { query: Pagination } = ctx
			.switchToHttp()
			.getRequest();

		const { take, page } = req.query;
		return {
			url: req.url.split('?')[0],
			take: take ? (+take <= 0 ? 10 : +take) : 10,
			page: page ? (+page <= 0 ? 1 : +page) : 1,
		};
	}
);

export function ApiPaginationDecorator() {
	return applyDecorators(
		ApiQuery({ name: 'take', type: 'integer', required: false }),
		ApiQuery({ name: 'page', type: 'integer', required: false })
	);
}
