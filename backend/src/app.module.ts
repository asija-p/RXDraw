import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrawingsController } from './drawings/drawings.controller';
import { DrawingsModule } from './drawings/drawings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'typeorm.config';
import { UsersModule } from './users/users.module';
import { FoldersModule } from './folders/folders.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DrawingsModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UsersModule,
    FoldersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
