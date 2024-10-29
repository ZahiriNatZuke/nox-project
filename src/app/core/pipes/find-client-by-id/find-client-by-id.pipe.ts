import { ClientService } from '@app/features/client/client.service';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class FindClientByIdPipe implements PipeTransform {
	constructor(private clientService: ClientService) {}

	async transform(id: string) {
		const result = z.string().uuid('Invalid UUID').safeParse(id);
		if (!result.success) throw new NotFoundException(result.error.errors);

		try {
			return await this.clientService.findOne({ id }, true);
		} catch (_) {
			throw new NotFoundException('Client not found');
		}
	}
}
