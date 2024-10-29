import { CreateRestaurantSchema } from '@app/features/restaurant/dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateRestaurantSchema = CreateRestaurantSchema.partial();

export class UpdateRestaurantZodDto extends createZodDto(
	UpdateRestaurantSchema
) {}

export type UpdateRestaurantDto = z.infer<typeof UpdateRestaurantSchema>;
