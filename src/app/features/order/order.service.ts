import { OrderPagination, OrderWithRelations } from '@app/core/types';
import { CreateOrderDto, UpdateOrderDto } from '@app/features/order/dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Order, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OrderService {
	readonly #defaultInclude = {
		client: true,
		restaurant: true,
	};

	constructor(private readonly prisma: PrismaService) {}

	async create({
		description,
		clientId,
		restaurantId,
		capacity,
	}: CreateOrderDto) {
		const restaurant = await this.prisma.restaurant.findUnique({
			where: { id: restaurantId },
		});

		if (!restaurant)
			throw new HttpException(
				{ message: 'Restaurant not found' },
				HttpStatus.NOT_FOUND
			);

		const client = await this.prisma.client.findUnique({
			where: { id: clientId },
		});

		if (!client)
			throw new HttpException(
				{ message: 'Client not found' },
				HttpStatus.NOT_FOUND
			);

		if (restaurant.capacity + capacity > restaurant.maxCapacity)
			throw new HttpException(
				{ message: 'Restaurant capacity exceeded' },
				HttpStatus.BAD_REQUEST
			);

		if (restaurant.onlyAdults && client.age < 18)
			throw new HttpException(
				{ message: 'Only adults are allowed' },
				HttpStatus.BAD_REQUEST
			);

		await this.prisma.restaurant.update({
			where: { id: restaurantId },
			data: { capacity: restaurant.capacity + capacity },
		});

		return this.prisma.order.create({
			data: { description, clientId, restaurantId, capacity },
			include: this.#defaultInclude,
		});
	}

	async findMany(
		params: OrderPagination
	): Promise<[number, OrderWithRelations[]]> {
		const { skip, take, where, orderBy } = params;
		return this.prisma.$transaction([
			this.prisma.order.count({
				where,
				orderBy,
			}),
			this.prisma.order.findMany({
				skip,
				take,
				where,
				orderBy,
				include: this.#defaultInclude,
			}),
		]);
	}

	async findOne(
		where: Prisma.OrderWhereUniqueInput,
		canThrow = false
	): Promise<OrderWithRelations | null> {
		if (canThrow)
			return this.prisma.order.findUniqueOrThrow({
				where,
				include: this.#defaultInclude,
			});

		return this.prisma.order.findUnique({
			where,
			include: this.#defaultInclude,
		});
	}

	async update(
		order: OrderWithRelations,
		{ description, capacity }: UpdateOrderDto
	): Promise<OrderWithRelations> {
		const diff = capacity - order.capacity;

		if (order.restaurant.capacity + diff > order.restaurant.maxCapacity)
			throw new HttpException(
				{ message: 'Restaurant capacity exceeded' },
				HttpStatus.BAD_REQUEST
			);

		await this.prisma.restaurant.update({
			where: { id: order.restaurantId },
			data: { capacity: order.restaurant.capacity + diff },
		});

		return this.prisma.order.update({
			where: { id: order.id },
			data: { description, capacity },
			include: this.#defaultInclude,
		});
	}

	async delete(where: Prisma.OrderWhereUniqueInput): Promise<Order> {
		return this.prisma.order.delete({
			where,
		});
	}
}
