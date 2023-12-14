import { Test, TestingModule } from '@nestjs/testing';
import { AuctionItemsController } from '../auctionItems.controller';
import { AuctionItemsService } from '../auctionItems.service';
import { CreateUpdateAuctionItemDto } from '../dto/createUpdateAuctionItem.dto';
import { AuctionItem } from 'src/entities/auction_item.entity';
import { Request } from 'express';
import { createMock } from '@golevelup/ts-jest';

describe('AuctionItemsController', () => {
  let controller: AuctionItemsController;
  let service: AuctionItemsService;

  const id = 'bfaf2387-fe80-489d-95d4-331f94163f65';

  let mockRequest: Request;

  beforeEach(async () => {
    mockRequest = createMock<Request>({
      headers: {
        cookie:
          'user_id=88b79697-a71a-4e34-9d3d-e8c13fcc4f41; other_cookie=abc;',
      },
      user: { id: id },
    });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuctionItemsController],
      providers: [
        {
          provide: AuctionItemsService,
          useValue: {
            paginate: jest.fn().mockResolvedValue({} as any),
            findById: jest.fn().mockResolvedValue(new AuctionItem()),
            findAll: jest.fn().mockResolvedValue([]),
            findByUser: jest.fn().mockResolvedValue([]),
            fetchByUser: jest.fn().mockResolvedValue([]),
            findBidded: jest.fn().mockResolvedValue([]),
            findAuctionByAuctionId: jest
              .fn()
              .mockResolvedValue(new AuctionItem()),
            findWon: jest.fn().mockResolvedValue([]),
            findWinning: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(new AuctionItem()),
            create: jest.fn().mockResolvedValue(new AuctionItem()),
            upload: jest.fn().mockResolvedValue(new AuctionItem()),
            handleFileUpload: jest.fn().mockResolvedValue(new AuctionItem()),
            update: jest.fn().mockResolvedValue(new AuctionItem()),
            remove: jest.fn().mockResolvedValue(new AuctionItem()),
          },
        },
      ],
    }).compile();

    controller = module.get<AuctionItemsController>(AuctionItemsController);
    service = module.get<AuctionItemsService>(AuctionItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all auction items', async () => {
    await controller.findAll(1);
    expect(service.paginate).toHaveBeenCalled();
  });

  it('should get auction items by user', async () => {
    await controller.findByUser(id);
    expect(service.fetchByUser).toHaveBeenCalled();
  });

  it('should get auction items bidded by user', async () => {
    await controller.findBidded(id);
    expect(service.findBidded).toHaveBeenCalled();
  });

  it('should get auction items won by user', async () => {
    await controller.findWon(id);
    expect(service.findWon).toHaveBeenCalled();
  });

  it('should get auction items winning by user', async () => {
    await controller.findWinning(id);
    expect(service.findWinning).toHaveBeenCalled();
  });

  it('should get an auction item', async () => {
    await controller.findOne(id);
    expect(service.findAuctionByAuctionId).toHaveBeenCalled();
  });

  it('should create an auction item', async () => {
    const dto = new CreateUpdateAuctionItemDto();
    await controller.create(dto, mockRequest);
    expect(service.create).toHaveBeenCalled();
  });

  it('should upload an image for an auction item', async () => {
    await controller.upload({} as any, id, mockRequest);
    expect(service.handleFileUpload).toHaveBeenCalled();
  });

  it('should update an auction item', async () => {
    const dto = new CreateUpdateAuctionItemDto();
    await controller.update(id, dto);
    expect(service.update).toHaveBeenCalled();
  });

  it('should remove an auction item', async () => {
    await controller.remove(id);
    expect(service.remove).toHaveBeenCalled();
  });
});
