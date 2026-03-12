import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';

@ApiTags('places')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/places') // nested route for places under trips
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Add a place to a trip' })
  create(
    @Param('tripId') tripId: string,
    @Body() dto: CreatePlaceDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.placesService.create(tripId, dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all places in a trip' })
  findAll(
    @Param('tripId') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.placesService.findAll(tripId, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a place' })
  remove(
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.placesService.remove(tripId, id, req.user.id);
  }
}
