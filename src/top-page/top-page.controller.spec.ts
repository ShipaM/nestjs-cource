import { Test, TestingModule } from '@nestjs/testing';
import { TopPageController } from './top-page.controller.js';
import { TopLevelCategory } from './top-page.model.js';

describe('TopPageController', () => {
  let controller: TopPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopPageController],
    }).compile();

    controller = module.get<TopPageController>(TopPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // The top-page feature is not implemented yet: every route handler is a
  // no-op stub. These tests document that current behaviour so a future
  // implementation change is a deliberate, visible diff rather than a silent
  // regression.
  it('create resolves without a value', async () => {
    await expect(
      controller.create({
        firstCategory: TopLevelCategory.Courses,
        secondCategory: 'Second category',
        alias: 'alias',
        title: 'Title',
        category: 'Category',
        advantages: [],
        seoText: 'Seo text',
        tagsTitle: 'Tags title',
        tags: [],
      } as any),
    ).resolves.toBeUndefined();
  });

  it('get resolves without a value', async () => {
    await expect(controller.get('id')).resolves.toBeUndefined();
  });

  it('delete resolves without a value', async () => {
    await expect(controller.delete('id')).resolves.toBeUndefined();
  });

  it('update resolves without a value', async () => {
    await expect(
      controller.update('id', {} as any),
    ).resolves.toBeUndefined();
  });

  it('find resolves without a value', async () => {
    await expect(
      controller.find({ firstCategory: TopLevelCategory.Courses }),
    ).resolves.toBeUndefined();
  });
});
