import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { CreateClientSchema } from './create-client.dto';

export const UpdateClientSchema = CreateClientSchema.partial();

export class UpdateClientZodDto extends createZodDto(UpdateClientSchema) {}

export type UpdateClientDto = z.infer<typeof UpdateClientSchema>;
