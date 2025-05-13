import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/movie-api'),
    AuthModule,
    MoviesModule,
  ],
})

export class AppModule {}
