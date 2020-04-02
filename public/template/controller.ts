import { Controller } from '@nestjs/common';
import { TestService } from './service/test.service';

@Controller('/v1/test')
export class TestController {
  constructor(private readonly testService: TestService) {
  }
}
