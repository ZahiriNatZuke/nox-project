import { RestaurantService } from '@app/features/restaurant/restaurant.service';
import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class FindRestaurantByIdPipe implements PipeTransform {
	constructor(private restaurantService: RestaurantService) {}

	async transform(id: string) {
		const result = z.string().uuid('Invalid UUID').safeParse(id);
		if (!result.success) throw new NotFoundException(result.error.errors);

		try {
			return await this.restaurantService.findOne({ id }, true);
		} catch (_) {
			throw new NotFoundException('Restaurant not found');
		}
	}
}
