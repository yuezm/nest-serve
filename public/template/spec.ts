import { Test, TestingModule } from '@nestjs/testing';
import { <%= nameHump %>Controller } from './<%= path %>.controller';
import { <%= nameHump %>Service } from './<%= path %>.service';

describe('<%= nameHump %>Controller', () => {
  let <%= name %>Controller: <%= nameHump %>Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ <%= nameHump %>Controller ],
      providers: [ <%= nameHump %>Service ],
    }).compile();

    <%= name %>Controller = app.get<<%= nameHump %>Controller>(<%= nameHump %>Controller);
  });

  describe('test <%= nameHump %>Controller', () => {
    it('<%= nameHump %>Controller ... Method', () => {
      expect(true);
    });
  });
});
