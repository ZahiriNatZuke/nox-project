import { RestaurantService } from '@app/features/restaurant/restaurant.service';
import {
	HttpException,
	HttpStatus,
	Injectable,
	NotFoundException,
	PipeTransform,
} from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class FindRestaurantByIdPipe implements PipeTransform {
	constructor(private restaurantService: RestaurantService) {}

	async transform(id: string) {
		const result = z.string().uuid('Invalid UUID').safeParse(id);
		if (!result.success)
			throw new NotFoundException({
				message: result.error.message,
				error: result.error.errors,
			});

		try {
			return await this.restaurantService.findOne({ id }, true);
		} catch (_) {
			throw new HttpException(
				{ message: 'Restaurant not found' },
				HttpStatus.NOT_FOUND
			);
		}
	}
}
