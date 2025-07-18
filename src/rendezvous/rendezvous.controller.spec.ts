import { Test, TestingModule } from '@nestjs/testing';
import { RendezvousController } from './rendezvous.controller';

describe('RendezvousController', () => {
  let controller: RendezvousController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RendezvousController],
    }).compile();

    controller = module.get<RendezvousController>(RendezvousController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
