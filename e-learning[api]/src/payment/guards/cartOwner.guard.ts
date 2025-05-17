import { CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';

export class CartOwnerGuard implements CanActivate {
  constructor(@InjectRepository(Cart) private carts: Repository<Cart>) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { id:uid, role } = request.user;
    if (role === 1 || role === 2) return true;
    const { id } = request.params;
    console.info({ id, uid, role });
    const cart = await this.carts.findOne({
      where: { id: id, user: { id: uid } },
      relations: { user: true },
    });
    return uid === cart?.user.id;
  }
}
