import { CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '..//entities/payment.entity';

export class PaymentOwnerOrStaffGuard implements CanActivate {
  constructor(
    @InjectRepository(Payment) private payments: Repository<Payment>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { id: uid, role } = request.user;
    if (role === 1 || role === 2) return true;
    const { id } = request.params;
    const payment = await this.payments.findOne({
      where: { id: id, user: { id: uid } },
      relations: { user: true },
    });
    return uid === payment?.user.id;
  }
}
