import { CreateOrderSchema } from '@app/features/order/dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateOrderSchema = CreateOrderSchema.pick({
	capacity: true,
	description: true,
});

export class UpdateOrderZodDto extends createZodDto(UpdateOrderSchema) {}

export type UpdateOrderDto = z.infer<typeof UpdateOrderSchema>;
