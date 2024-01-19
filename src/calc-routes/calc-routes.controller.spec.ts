import { Test, TestingModule } from '@nestjs/testing';
import { CalcRoutesController } from './calc-routes.controller';

describe('CalcRoutesController', () => {
  let controller: CalcRoutesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalcRoutesController],
    }).compile();

    controller = module.get<CalcRoutesController>(CalcRoutesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
