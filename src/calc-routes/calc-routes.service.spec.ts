import { Test, TestingModule } from '@nestjs/testing';
import { CalcRoutesService } from './calc-routes.service';

describe('CalcRoutesService', () => {
  let service: CalcRoutesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalcRoutesService],
    }).compile();

    service = module.get<CalcRoutesService>(CalcRoutesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
