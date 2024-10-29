import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateOrderSchema = z
	.object({
		description: z.string().trim().min(1),
		clientId: z.string().uuid(),
		restaurantId: z.string().uuid(),
		capacity: z.coerce.number().int().positive().min(1),
	})
	.required();

export class CreateOrderZodDto extends createZodDto(CreateOrderSchema) {}

export type CreateOrderDto = z.infer<typeof CreateOrderSchema>;
