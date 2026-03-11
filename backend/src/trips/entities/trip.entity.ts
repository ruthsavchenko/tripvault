import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TripMember } from './trip-member.entity';
import { Place } from '../../places/entities/place.entity';
import { Expense } from '../../expenses/entities/expense.entity';

@Entity('trips')
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => TripMember, (member) => member.trip, { cascade: true })
  members: TripMember[];

  @OneToMany(() => Place, (place) => place.trip, { cascade: true })
  places: Place[];

  @OneToMany(() => Expense, (expense) => expense.trip, { cascade: true })
  expenses: Expense[];
}
