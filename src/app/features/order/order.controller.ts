import {
	ApiPaginationDecorator,
	PaginationDecorator,
} from '@app/core/decorators';
import { FindOrderByIdPipe } from '@app/core/pipes';
import {
	OrderPagination,
	OrderWithRelations,
	Pagination,
} from '@app/core/types';
import { generateMetadata } from '@app/core/utils';
import { CreateOrderZodDto, UpdateOrderZodDto } from '@app/features/order/dto';
import { OrderService } from '@app/features/order/order.service';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Res,
} from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('order')
@ApiTags('Order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Post()
	async create(
		@Res() res: Response,
		@Body() createOrderDto: CreateOrderZodDto
	) {
		return res.status(HttpStatus.CREATED).send({
			statusCode: HttpStatus.CREATED,
			status: 'success',
			message: 'Order created successfully',
			data: await this.orderService.create(createOrderDto),
		});
	}

	@Get()
	@ApiPaginationDecorator()
	async findAll(
		@Res() res: Response,
		@PaginationDecorator() pagination: Pagination
	) {
		const { take, page, url } = pagination;
		const entityPagination: OrderPagination = {
			orderBy: { createdAt: 'asc' },
			take,
			skip: (page - 1) * take,
		};
		const [total, orders] = await this.orderService.findMany(entityPagination);
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			data: orders,
			meta: generateMetadata({ total, take, page, url }),
		});
	}

	@Get(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async findOne(
		@Res() res: Response,
		@Param('id', FindOrderByIdPipe) order: OrderWithRelations
	) {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			data: order,
		});
	}

	@Patch(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async update(
		@Res() res: Response,
		@Param('id', FindOrderByIdPipe) order: OrderWithRelations,
		@Body() updateOrderDto: UpdateOrderZodDto
	) {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'Order updated successfully',
			data: await this.orderService.update(order, updateOrderDto),
		});
	}

	@Delete(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async remove(
		@Res() res: Response,
		@Param('id', FindOrderByIdPipe) { id }: OrderWithRelations
	) {
		await this.orderService.delete({ id });
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'Order deleted successfully',
		});
	}
}
