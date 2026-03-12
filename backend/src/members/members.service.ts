import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripMember, TripRole } from '../trips/entities/trip-member.entity';
import { User } from '../users/entities/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(TripMember)
    private readonly memberRepo: Repository<TripMember>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async invite(tripId: string, dto: InviteMemberDto, requesterId: string) {
    await this.assertOwner(tripId, requesterId);

    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new NotFoundException('User with this email not found');

    const existing = await this.memberRepo.findOneBy({
      tripId,
      userId: user.id,
    });
    if (existing)
      throw new BadRequestException('User is already a member of this trip');

    const member = this.memberRepo.create({
      tripId,
      userId: user.id,
      role: 'viewer',
    });
    return this.memberRepo.save(member);
  }

  async findAll(tripId: string, requesterId: string) {
    await this.assertMember(tripId, requesterId);

    return this.memberRepo.find({
      where: { tripId },
      relations: ['user'],
    });
  }

  async updateRole(
    tripId: string,
    memberId: string,
    role: TripRole,
    requesterId: string,
  ) {
    await this.assertOwner(tripId, requesterId);

    const member = await this.memberRepo.findOneBy({ id: memberId, tripId });
    if (!member) throw new NotFoundException('Member not found');

    if (member.userId === requesterId) {
      throw new BadRequestException('You cannot change your own role');
    }

    member.role = role;
    return this.memberRepo.save(member);
  }

  async remove(tripId: string, memberId: string, requesterId: string) {
    await this.assertOwner(tripId, requesterId);

    const member = await this.memberRepo.findOneBy({ id: memberId, tripId });
    if (!member) throw new NotFoundException('Member not found');

    if (member.userId === requesterId) {
      throw new BadRequestException(
        'Owner cannot remove themselves. Delete the trip instead.',
      );
    }

    await this.memberRepo.delete(member.id);
    return { message: 'Member removed' };
  }

  async leave(tripId: string, requesterId: string) {
    const member = await this.memberRepo.findOneBy({
      tripId,
      userId: requesterId,
    });
    if (!member)
      throw new NotFoundException('You are not a member of this trip');

    if (member.role === 'owner') {
      throw new BadRequestException(
        'Owner cannot leave the trip. Transfer ownership or delete the trip.',
      );
    }

    await this.memberRepo.delete(member.id);
    return { message: 'You have left the trip' };
  }

  private async assertOwner(tripId: string, userId: string) {
    const member = await this.memberRepo.findOneBy({
      tripId,
      userId,
      role: 'owner',
    });
    if (!member)
      throw new ForbiddenException(
        'Only the trip owner can perform this action',
      );
  }

  private async assertMember(tripId: string, userId: string) {
    const member = await this.memberRepo.findOneBy({ tripId, userId });
    if (!member) throw new ForbiddenException('Access denied');
  }
}
