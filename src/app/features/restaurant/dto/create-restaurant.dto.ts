import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateRestaurantSchema = z
	.object({
		name: z.string().trim().min(1),
		address: z.string().trim().min(1),
		maxCapacity: z.coerce.number().positive().int().min(1),
		onlyAdults: z.boolean().default(false),
	})
	.required();

export class CreateRestaurantZodDto extends createZodDto(
	CreateRestaurantSchema
) {}

export type CreateRestaurantDto = z.infer<typeof CreateRestaurantSchema>;
