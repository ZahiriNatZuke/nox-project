import { ClientController } from '@app/features/client/client.controller';
import { ClientService } from '@app/features/client/client.service';
import { Module } from '@nestjs/common';

@Module({
	controllers: [ClientController],
	providers: [ClientService],
})
export class ClientModule {}
