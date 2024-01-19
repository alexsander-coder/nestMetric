import { Module } from '@nestjs/common';
import { CreateClientController } from './create-client/create-client.controller';
import { CreateClientService } from './create-client/create-client.service';
import { Pool } from 'pg';
import { CalcRoutesService } from './calc-routes/calc-routes.service';
import { CalcRoutesController } from './calc-routes/calc-routes.controller';

@Module({
  imports: [],
  controllers: [CreateClientController, CalcRoutesController],
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
  }, CalcRoutesService],
})
export class AppModule {}
