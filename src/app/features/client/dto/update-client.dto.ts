import { CreateClientSchema } from '@app/features/client/dto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateClientSchema = CreateClientSchema.partial();

export class UpdateClientZodDto extends createZodDto(UpdateClientSchema) {}

export type UpdateClientDto = z.infer<typeof UpdateClientSchema>;
