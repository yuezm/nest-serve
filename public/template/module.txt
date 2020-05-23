import { Module } from '@nestjs/common';

import { <%= nameHump %>Controller } from './<%= path %>.controller';
import { <%= nameHump %>Service } from './<%= path %>.service';

@Module({
  controllers: [ <%= nameHump %>Controller ],
  providers: [ <%= nameHump %>Service ],
})
export class <%= nameHump %>Module {
}
