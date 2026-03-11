import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@ApiTags('trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trip' })
  create(@Body() dto: CreateTripDto, @Request() req: { user: { id: string } }) {
    return this.tripsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all my trips' })
  findAll(@Request() req: { user: { id: string } }) {
    return this.tripsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get trip details' })
  findOne(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.tripsService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update trip (owner only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTripDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.tripsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete trip (owner only)' })
  remove(@Param('id') id: string, @Request() req: { user: { id: string } }) {
    return this.tripsService.remove(id, req.user.id);
  }
}
