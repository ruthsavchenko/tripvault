import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripMember } from '../trips/entities/trip-member.entity';
import { User } from '../users/entities/user.entity';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';

@Module({
  imports: [TypeOrmModule.forFeature([TripMember, User])],
  controllers: [MembersController],
  providers: [MembersService],
})
export class MembersModule {}
