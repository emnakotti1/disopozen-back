import { Test, TestingModule } from '@nestjs/testing';
import { RendezVousController  } from './rendezvous.controller';

describe('RendezvousController', () => {
  let controller: RendezVousController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RendezVousController],
    }).compile();

    controller = module.get<RendezVousController>(RendezVousController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
