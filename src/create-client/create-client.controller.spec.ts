import { Test, TestingModule } from '@nestjs/testing';
import { CreateClientController } from './create-client.controller';

describe('CreateClientController', () => {
  let controller: CreateClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateClientController],
    }).compile();

    controller = module.get<CreateClientController>(CreateClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
