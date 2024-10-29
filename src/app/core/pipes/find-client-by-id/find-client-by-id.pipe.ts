import { ClientService } from '@app/features/client/client.service';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';

@Injectable()
export class FindClientByIdPipe implements PipeTransform {
	constructor(private clientService: ClientService) {}

	async transform(id: string) {
		try {
			return await this.clientService.findOne({ id }, true);
		} catch (_) {
			throw new NotFoundException('Client not found');
		}
	}
}
