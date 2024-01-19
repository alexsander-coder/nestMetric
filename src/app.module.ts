import { Module } from '@nestjs/common';
import { CreateClientController } from './create-client/create-client.controller';
import { CreateClientService } from './create-client/create-client.service';
import { Pool } from 'pg';

@Module({
  imports: [],
  controllers: [CreateClientController],
  providers: [CreateClientService, {
    provide: 'PG_POOL',
    useFactory: () => {
      return new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'postgres',
        port: 5432,
      });
    },
  }],
})
export class AppModule {}
