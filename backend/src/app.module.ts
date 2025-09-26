import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrawingsController } from './drawings/drawings.controller';
import { DrawingsModule } from './drawings/drawings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { UsersModule } from './users/users.module';
import { UsersControllerController } from './user/users-controller/users-controller.controller';

@Module({
  imports: [DrawingsModule, TypeOrmModule.forRoot(typeOrmConfig), UsersModule],
  controllers: [AppController, UsersControllerController],
  providers: [AppService],
})
export class AppModule {}
