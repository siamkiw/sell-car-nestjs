import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity'
import { Report } from './reports/report.entity';
const cookieSession = require('cookie-session')

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: "db.sqlite",
      entities: [User, Report],
      synchronize: true
    }),
    ReportsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // setup pipe in app.module
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      })
    }
  ],
})

export class AppModule {
  // run on every comming request middleware
  configure(consumer: MiddlewareConsumer) {

    consumer
      .apply(
        cookieSession({
          keys: ['thisisrandomtext']
        })
      ).forRoutes('*')

  }
}
