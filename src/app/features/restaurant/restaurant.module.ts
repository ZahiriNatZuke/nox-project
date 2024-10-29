import { RestaurantController } from '@app/features/restaurant/restaurant.controller';
import { RestaurantService } from '@app/features/restaurant/restaurant.service';
import { Module } from '@nestjs/common';

@Module({
	controllers: [RestaurantController],
	providers: [RestaurantService],
})
export class RestaurantModule {}
