import { Controller, Get } from '@nestjs/common';
import { CalcRoutesService } from './calc-routes.service';

@Controller('calc-routes')
export class CalcRoutesController {
  constructor(private readonly calcRoutesService: CalcRoutesService) { }

  @Get()
  async findAll(): Promise<any[]> {
    return this.calcRoutesService.findAll();
  }

  @Get('/calcular-rota')
  async calcularRota(): Promise<any[]> {
    return this.calcRoutesService.calcularRota();
  }
}
