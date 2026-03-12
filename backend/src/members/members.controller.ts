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
import { MembersService } from './members.service';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@ApiTags('members')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: 'Invite a user to the trip by email (owner only)' })
  invite(
    @Param('tripId') tripId: string,
    @Body() dto: InviteMemberDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.membersService.invite(tripId, dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all members of a trip' })
  findAll(
    @Param('tripId') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.membersService.findAll(tripId, req.user.id);
  }

  // IMPORTANT: 'me' route must be declared before ':memberId'
  // to prevent NestJS from treating the string "me" as a memberId
  @Delete('me')
  @ApiOperation({ summary: 'Leave the trip (viewer only)' })
  leave(
    @Param('tripId') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.membersService.leave(tripId, req.user.id);
  }

  @Patch(':memberId')
  @ApiOperation({ summary: 'Change a member role (owner only)' })
  updateRole(
    @Param('tripId') tripId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.membersService.updateRole(
      tripId,
      memberId,
      dto.role,
      req.user.id,
    );
  }

  @Delete(':memberId')
  @ApiOperation({ summary: 'Remove a member from the trip (owner only)' })
  remove(
    @Param('tripId') tripId: string,
    @Param('memberId') memberId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.membersService.remove(tripId, memberId, req.user.id);
  }
}
