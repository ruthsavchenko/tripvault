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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trips/:tripId/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Add an expense to a trip' })
  create(
    @Param('tripId') tripId: string,
    @Body() dto: CreateExpenseDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.expensesService.create(tripId, dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expenses in a trip' })
  findAll(
    @Param('tripId') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.expensesService.findAll(tripId, req.user.id);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get expenses summary by category (for dashboard)' })
  getSummary(
    @Param('tripId') tripId: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.expensesService.getSummary(tripId, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense' })
  remove(
    @Param('tripId') tripId: string,
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.expensesService.remove(tripId, id, req.user.id);
  }
}
