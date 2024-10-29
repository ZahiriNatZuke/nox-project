import {
	RestaurantPagination,
	RestaurantWithCount,
	RestaurantWithRelations,
} from '@app/core/types';
import {
	CreateRestaurantDto,
	UpdateRestaurantDto,
} from '@app/features/restaurant/dto';
import { Injectable } from '@nestjs/common';
import { Prisma, Restaurant } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class RestaurantService {
	readonly #defaultInclude = {
		_count: true,
		orders: true,
	};

	constructor(private readonly prisma: PrismaService) {}

	create({ name, maxCapacity, address, onlyAdults }: CreateRestaurantDto) {
		return this.prisma.restaurant.create({
			data: { name, maxCapacity, address, onlyAdults },
		});
	}

	async findMany(
		params: RestaurantPagination
	): Promise<[number, RestaurantWithCount[]]> {
		const { skip, take, where, orderBy } = params;
		return this.prisma.$transaction([
			this.prisma.restaurant.count({
				where,
				orderBy,
			}),
			this.prisma.restaurant.findMany({
				skip,
				take,
				where,
				orderBy,
				include: {
					_count: true,
				},
			}),
		]);
	}

	async findOne(
		where: Prisma.RestaurantWhereUniqueInput,
		canThrow = false
	): Promise<RestaurantWithRelations | null> {
		if (canThrow) {
			return this.prisma.restaurant.findUniqueOrThrow({
				where,
				include: this.#defaultInclude,
			});
		}

		return this.prisma.restaurant.findUnique({
			where,
			include: this.#defaultInclude,
		});
	}

	async update(
		where: Prisma.RestaurantWhereUniqueInput,
		data: UpdateRestaurantDto
	): Promise<RestaurantWithRelations> {
		return this.prisma.restaurant.update({
			where,
			data,
			include: this.#defaultInclude,
		});
	}

	async delete(where: Prisma.RestaurantWhereUniqueInput): Promise<Restaurant> {
		return this.prisma.restaurant.delete({
			where,
		});
	}
}
