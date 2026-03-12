import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { TripsService } from '../trips/trips.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
    private readonly tripsService: TripsService,
  ) {}

  async create(tripId: string, dto: CreateExpenseDto, userId: string) {
    await this.tripsService.findOne(tripId, userId);
    const expense = this.expenseRepo.create({ ...dto, tripId });
    return this.expenseRepo.save(expense);
  }

  async findAll(tripId: string, userId: string) {
    await this.tripsService.findOne(tripId, userId);
    return this.expenseRepo.find({
      where: { tripId },
      order: { date: 'ASC' },
    });
  }

  // expanses aggregation by category - for dashboard pie chart
  async getSummary(tripId: string, userId: string) {
    await this.tripsService.findOne(tripId, userId);

    const rows = await this.expenseRepo
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('SUM(expense.amount)', 'total')
      .where('expense.tripId = :tripId', { tripId })
      .groupBy('expense.category')
      .getRawMany<{ category: string; total: string }>();

    return rows.map((r) => ({
      category: r.category,
      total: parseFloat(r.total),
    }));
  }

  async remove(tripId: string, id: string, userId: string) {
    await this.tripsService.findOne(tripId, userId);
    await this.expenseRepo.delete(id);
    return { message: 'Expense deleted' };
  }
}
