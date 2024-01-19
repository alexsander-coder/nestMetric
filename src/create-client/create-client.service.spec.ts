import { Test, TestingModule } from '@nestjs/testing';
import { CreateClientService } from './create-client.service';

describe('CreateClientService', () => {
  let service: CreateClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateClientService],
    }).compile();

    service = module.get<CreateClientService>(CreateClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
