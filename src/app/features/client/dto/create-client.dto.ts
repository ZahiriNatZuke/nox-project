import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateClientSchema = z
	.object({
		name: z.string().trim().min(1),
		email: z.string().email(),
		phone: z
			.string()
			.regex(
				/^\+?\d{1,3}(?:[-.\s]?\(?\d{1,4}\)?)?(?:[-.\s]?\d{1,4}){2,3}$/,
				'Invalid phone number'
			),
		age: z.coerce.number().positive().int().min(1).max(120),
	})
	.required();

export class CreateClientZodDto extends createZodDto(CreateClientSchema) {}

export type CreateClientDto = z.infer<typeof CreateClientSchema>;
