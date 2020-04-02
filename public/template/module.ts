import { Module } from '@nestjs/common';

import { <%= nameHump %>Controller } from './<%= name %>.controller';
import { <%= nameHump %>Service } from './<%= name %>.service';

@Module({
  controllers: [ <%= nameHump %>Controller ],
  providers: [ <%= nameHump %>Service ],
})
export class <%= nameHump %>Module {
}
