import { OrderService } from '@app/features/order/order.service';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class FindOrderByIdPipe implements PipeTransform {
	constructor(private orderService: OrderService) {}

	async transform(id: string) {
		const result = z.string().uuid('Invalid UUID').safeParse(id);
		if (!result.success) throw new NotFoundException(result.error.errors);

		try {
			return await this.orderService.findOne({ id }, true);
		} catch (_) {
			throw new NotFoundException('Order not found');
		}
	}
}
