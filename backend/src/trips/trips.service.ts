import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from './entities/trip.entity';
import { TripMember } from './entities/trip-member.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepo: Repository<Trip>,
    @InjectRepository(TripMember)
    private readonly memberRepo: Repository<TripMember>,
  ) {}

  async create(dto: CreateTripDto, userId: string) {
    const trip = this.tripRepo.create(dto);
    await this.tripRepo.save(trip);

    const member = this.memberRepo.create({
      tripId: trip.id,
      userId,
      role: 'owner',
    });
    await this.memberRepo.save(member);

    return trip;
  }

  findAll(userId: string) {
    return this.tripRepo
      .createQueryBuilder('trip')
      .innerJoin('trip.members', 'member', 'member.userId = :userId', {
        userId,
      })
      .leftJoinAndSelect('trip.members', 'allMembers')
      .orderBy('trip.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, userId: string) {
    const trip = await this.tripRepo.findOne({
      where: { id },
      relations: ['members', 'members.user', 'places', 'expenses'],
    });

    if (!trip) throw new NotFoundException('Trip not found');

    const isMember = trip.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');

    return trip;
  }

  async update(id: string, dto: UpdateTripDto, userId: string) {
    await this.assertOwner(id, userId);
    await this.tripRepo.update(id, dto);
    return this.tripRepo.findOneBy({ id });
  }

  async remove(id: string, userId: string) {
    await this.assertOwner(id, userId);
    await this.tripRepo.delete(id);
    return { message: 'Trip deleted' };
  }

  private async assertOwner(tripId: string, userId: string) {
    const member = await this.memberRepo.findOne({
      where: { tripId, userId, role: 'owner' },
    });
    if (!member)
      throw new ForbiddenException('Only owner can perform this action');
  }
}
