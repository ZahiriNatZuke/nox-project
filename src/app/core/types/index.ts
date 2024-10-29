/* Interfaces */
import { EntityPagination } from '@app/core/types/interfaces/entity-pagination';
import { Prisma } from '@prisma/client';

export * from './interfaces/pagination';
export * from './interfaces/entity-pagination';

/* Types */
export type ClientPagination = EntityPagination<
	Prisma.ClientWhereInput,
	Prisma.ClientOrderByWithRelationInput
>;
export type OrderPagination = EntityPagination<
	Prisma.OrderWhereInput,
	Prisma.OrderOrderByWithRelationInput
>;
export type RestaurantPagination = EntityPagination<
	Prisma.RestaurantWhereInput,
	Prisma.RestaurantOrderByWithRelationInput
>;
export type ClientWithCount = Prisma.ClientGetPayload<{
	include: { _count: true };
}>;
export type ClientWithRelations = Prisma.ClientGetPayload<{
	include: { _count: true; orders: true };
}>;
export type RestaurantWithCount = Prisma.RestaurantGetPayload<{
	include: { _count: true };
}>;
export type RestaurantWithRelations = Prisma.RestaurantGetPayload<{
	include: { _count: true; orders: true };
}>;
