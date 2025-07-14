import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule } from '@nestjs/microservices';
import * as path from 'path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@database/entities/user.entity';
import { getKafkaConfig } from '@kafka/config/kafka.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../../.env'),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get('DB_HOST', 'localhost'),
          port: parseInt(config.get('DB_PORT', '5432')),
          username: config.get('DB_USERNAME'),
          password: config.get('DB_PASSWORD'),
          database: config.get('DB_DATABASE'),
          entities: [User],
          synchronize: config.get('DB_SYNCHRONIZE') === 'true',
          logging: config.get('DB_LOGGING') === 'true',
          ssl: config.get('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        };
      },
    }),
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '24h' },
    }),
    PassportModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        ...getKafkaConfig(),
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AppModule {}