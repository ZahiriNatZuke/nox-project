import {
	ClientPagination,
	ClientWithCount,
	ClientWithRelations,
} from '@app/core/types';
import { CreateClientDto, UpdateClientDto } from '@app/features/client/dto';
import { Injectable } from '@nestjs/common';
import { Client, Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ClientService {
	readonly #defaultInclude = {
		_count: true,
		orders: true,
	};

	constructor(private readonly prisma: PrismaService) {}

	create({ age, email, name, phone }: CreateClientDto) {
		return this.prisma.client.create({
			data: { age, email, name, phone },
		});
	}

	async findMany(
		params: ClientPagination
	): Promise<[number, ClientWithCount[]]> {
		const { skip, take, where, orderBy } = params;
		return this.prisma.$transaction([
			this.prisma.client.count({
				where,
				orderBy,
			}),
			this.prisma.client.findMany({
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
		where: Prisma.ClientWhereUniqueInput,
		canThrow = false
	): Promise<ClientWithRelations | null> {
		if (canThrow) {
			return this.prisma.client.findUniqueOrThrow({
				where,
				include: this.#defaultInclude,
			});
		}

		return this.prisma.client.findUnique({
			where,
			include: this.#defaultInclude,
		});
	}

	async update(
		where: Prisma.ClientWhereUniqueInput,
		data: UpdateClientDto
	): Promise<ClientWithRelations> {
		return this.prisma.client.update({
			where,
			data,
			include: this.#defaultInclude,
		});
	}

	async delete(where: Prisma.ClientWhereUniqueInput): Promise<Client> {
		return this.prisma.client.delete({
			where,
		});
	}
}
