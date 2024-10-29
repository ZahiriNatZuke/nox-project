import {
	ApiPaginationDecorator,
	PaginationDecorator,
} from '@app/core/decorators';
import { FindRestaurantByIdPipe, TrimQuerySearchPipe } from '@app/core/pipes';
import {
	ClientWithRelations,
	Pagination,
	RestaurantPagination,
	RestaurantWithRelations,
} from '@app/core/types';
import { generateMetadata } from '@app/core/utils/generate-metadata';
import {
	CreateRestaurantZodDto,
	UpdateRestaurantZodDto,
} from '@app/features/restaurant/dto';
import { RestaurantService } from '@app/features/restaurant/restaurant.service';
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	Res,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Controller('restaurant')
@ApiTags('Restaurant')
export class RestaurantController {
	constructor(private readonly restaurantService: RestaurantService) {}

	@Post()
	async create(
		@Res() res: Response,
		@Body() createRestaurantDto: CreateRestaurantZodDto
	) {
		return res.status(HttpStatus.CREATED).send({
			statusCode: HttpStatus.CREATED,
			status: 'success',
			message: 'Restaurant created successfully',
			data: await this.restaurantService.create(createRestaurantDto),
		});
	}

	@Get()
	@ApiPaginationDecorator()
	@ApiQuery({ name: 'name', required: false, type: 'string' })
	@ApiQuery({ name: 'address', required: false, type: 'string' })
	async findAll(
		@Res() res: Response,
		@PaginationDecorator() pagination: Pagination,
		@Query('name', TrimQuerySearchPipe) name?: string,
		@Query('address', TrimQuerySearchPipe) address?: string
	) {
		const { take, page, url } = pagination;
		const OR: Prisma.RestaurantWhereInput[] = [];
		if (name)
			OR.push({
				name: {
					search: name,
					mode: 'insensitive',
				},
			});
		if (address)
			OR.push({
				address: {
					search: address,
					mode: 'insensitive',
				},
			});

		const entityPagination: RestaurantPagination = {
			orderBy: { createdAt: 'asc' },
			take,
			skip: (page - 1) * take,
			where: {
				...(OR.length > 0 ? { OR } : {}),
			},
		};
		const [total, restaurants] =
			await this.restaurantService.findMany(entityPagination);
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			data: restaurants,
			meta: generateMetadata(
				{ total, take, page, url },
				{ query: { name, address } }
			),
		});
	}

	@Get(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	findOne(
		@Res() res: Response,
		@Param('id', FindRestaurantByIdPipe)
		restaurant: RestaurantWithRelations
	) {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			data: restaurant,
		});
	}

	@Patch(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async update(
		@Res() res: Response,
		@Param('id', FindRestaurantByIdPipe)
		{ id }: ClientWithRelations,
		@Body() updateRestaurantDto: UpdateRestaurantZodDto
	) {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'Restaurant updated successfully',
			data: await this.restaurantService.update({ id }, updateRestaurantDto),
		});
	}

	@Delete(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async remove(
		@Res() res: Response,
		@Param('id', FindRestaurantByIdPipe)
		{ id }: ClientWithRelations
	) {
		await this.restaurantService.delete({ id });
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'Restaurant deleted successfully',
		});
	}
}
