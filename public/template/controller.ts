import { Controller } from '@nestjs/common';
import { <%= nameHump %>Service } from './<%= name %>.service';

@Controller('/v1/<%= name %>')
export class <%= nameHump %>Controller {
  constructor(private readonly <%= name %>Service: <%= nameHump %>Service) {
  }
}
