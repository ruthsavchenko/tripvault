import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';
import { TripsService } from '../trips/trips.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@Injectable()
export class PlacesService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepo: Repository<Place>,
    private readonly tripsService: TripsService,
  ) {}

  async create(tripId: string, dto: CreatePlaceDto, userId: string) {
    await this.tripsService.findOne(tripId, userId);
    const place = this.placeRepo.create({ ...dto, tripId });
    return this.placeRepo.save(place);
  }

  async findAll(tripId: string, userId: string) {
    await this.tripsService.findOne(tripId, userId);
    return this.placeRepo.find({
      where: { tripId },
      order: { date: 'ASC' },
    });
  }

  async remove(tripId: string, id: string, userId: string) {
    await this.tripsService.findOne(tripId, userId);
    await this.placeRepo.delete(id);
    return { message: 'Place deleted' };
  }
}
