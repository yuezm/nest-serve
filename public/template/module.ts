import { Module } from '@nestjs/common';

import { <%= nameHump %>Controller } from './controller/<%= name %>.controller';
import { <%= nameHump %>Service } from './service/<%= name %>.service';

@Module({
  controllers: [ <%= nameHump %>Controller ],
  providers: [ <%= nameHump %>Service ],
})
export class <%= nameHump %>Module {
};
