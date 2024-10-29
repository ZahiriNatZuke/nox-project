import {
	ApiPaginationDecorator,
	PaginationDecorator,
} from '@app/core/decorators';
import { FindClientByIdPipe, TrimQuerySearchPipe } from '@app/core/pipes';
import {
	ClientPagination,
	ClientWithRelations,
	Pagination,
} from '@app/core/types';
import { generateMetadata } from '@app/core/utils/generate-metadata';
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
import { ClientService } from './client.service';
import { CreateClientZodDto } from './dto/create-client.dto';
import { UpdateClientZodDto } from './dto/update-client.dto';

@Controller('client')
@ApiTags('Client')
export class ClientController {
	constructor(private readonly clientService: ClientService) {}

	@Post()
	async create(
		@Body() createClientDto: CreateClientZodDto,
		@Res() res: Response
	) {
		return res.status(HttpStatus.CREATED).send({
			statusCode: HttpStatus.CREATED,
			status: 'success',
			message: 'Client created successfully',
			data: await this.clientService.create(createClientDto),
		});
	}

	@Get()
	@ApiPaginationDecorator()
	@ApiQuery({ name: 'name', required: false, type: 'string' })
	@ApiQuery({ name: 'email', required: false, type: 'string' })
	async findAll(
		@Res() res: Response,
		@PaginationDecorator() pagination: Pagination,
		@Query('name', TrimQuerySearchPipe) name?: string,
		@Query('email', TrimQuerySearchPipe) email?: string
	) {
		const { take, page, url } = pagination;
		const OR: Prisma.ClientWhereInput[] = [];
		if (name)
			OR.push({
				name: {
					contains: name,
					mode: 'insensitive',
				},
			});
		if (email)
			OR.push({
				email: {
					equals: email,
					mode: 'insensitive',
				},
			});

		const entityPagination: ClientPagination = {
			orderBy: { createdAt: 'asc' },
			take,
			skip: (page - 1) * take,
			where: {
				...(OR.length > 0 ? { OR } : {}),
			},
		};
		const [total, clients] =
			await this.clientService.findMany(entityPagination);
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			data: clients,
			meta: generateMetadata(
				{ total, take, page, url },
				{ query: { name, email } }
			),
		});
	}

	@Get(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	findOne(
		@Res() res: Response,
		@Param('id', FindClientByIdPipe)
		client: ClientWithRelations
	) {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			data: client,
		});
	}

	@Patch(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async update(
		@Res() res: Response,
		@Param('id', FindClientByIdPipe)
		{ id }: ClientWithRelations,
		@Body() updateClientDto: UpdateClientZodDto
	) {
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'Client updated successfully',
			data: await this.clientService.update({ id }, updateClientDto),
		});
	}

	@Delete(':id')
	@ApiParam({ name: 'id', type: 'string', required: true })
	async remove(
		@Res() res: Response,
		@Param('id', FindClientByIdPipe)
		{ id }: ClientWithRelations
	) {
		await this.clientService.delete({ id });
		return res.status(HttpStatus.OK).send({
			statusCode: HttpStatus.OK,
			status: 'success',
			message: 'Client deleted successfully',
		});
	}
}
