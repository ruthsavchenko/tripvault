import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { TripRole } from '../../trips/entities/trip-member.entity';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: ['owner', 'viewer'] })
  @IsIn(['owner', 'viewer'])
  role: TripRole;
}
