import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CourseService } from '../content/course.service';
import { TutorialService } from '../content/tuturial.service';
import { CartStatus } from '../common/enum/cart-status.enum';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto, discountCartDto } from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';
import { ICartContent } from './interfaces/cart-content.interface';

@Injectable()
export class CartService {
  constructor(
    private userService: UserService,
    private courseService: CourseService,
    private tutorialService: TutorialService,
    @InjectRepository(Cart) private carts: Repository<Cart>,
    @InjectRepository(CartItem) private cartitems: Repository<CartItem>,
  ) {}

  getCart(id: number) {
    return this.carts.findOne({
      where: { id: id },
      relations: { cartItems: true, user: true },
    });
  }
  async createCart(username: string, data: CreateCartDto) {
    const user = await this.userService.getUser(username);
    if (!user) {
      //! rare case scenarios!
      throw new HttpException(
        `User with name ${username} doesn't exist!`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (await this.getOpenCart(user.id)) {
      throw new HttpException(
        `User has an open cart with ID ${user.id}!`,
        HttpStatus.CONFLICT,
      );
    }
    const cart = this.carts.create({ user: user, totalPrice: 0 });
    await this.carts.save(cart);
    data.items.forEach((data) => {
      this.addCart(cart, data);
    });
    return this.updateCart(cart.id);
  }
  async discountCart(id: number, data: discountCartDto) {
    if (!(await this.isCartExists(id)) || (await this.isCartClosed(id))) {
      throw new HttpException(
        `Cart with ID ${id} doesen't exist, or closed!`,
        HttpStatus.NOT_FOUND,
      );
    }
    const cart = await this.carts.findOneBy({ id: id });
    if (cart?.discount) {
      cart.discount += 5;
      this.carts.save(cart);
    }
    return `Cart ${id}:${data.discountCode} Off!!!`;
  }
  async destroyCart(id: number) {
    const cart = await this.carts.findOneBy({
      id: id,
      status: CartStatus.Open,
    });
    if (cart) return this.carts.remove(cart);
    throw new HttpException(
      `Cart with ID ${id} doesen't exist, or closed!`,
      HttpStatus.NOT_FOUND,
    );
  }
  async updateCart(id: number) {
    const cart = await this.carts.findOneBy({ id: id });
    const total = cart?.cartItems.map((c) => c.price).reduce((a, b) => a + b);
    cart!.totalPrice = total ?? 0;
    return this.carts.save(cart!);
  }

  private getOpenCart(uid: number) {
    return this.carts.findOne({
      relations: { user: true },
      where: { status: CartStatus.Open, user: { id: uid } },
    });
  }
  private isCartExists(id: number) {
    return this.carts.exists({ where: { id: id } });
  }
  private isCartClosed(id: number) {
    return this.carts.exists({
      where: { id: id, status: CartStatus.Close },
    });
  }

  async insertCart(id: number, data: InsertCartDto) {
    if (!(await this.isCartExists(id)) || (await this.isCartClosed(id))) {
      throw new HttpException(
        `Cart with ID ${id} doesen't exist, or closed!`,
        HttpStatus.NOT_FOUND,
      );
    }
    const cart = await this.carts.findOneBy({ id: id });
    await this.addCart(cart!, data);
    return this.updateCart(id);
  }
  async removeCart(id: number, pid: number) {
    if (!(await this.isCartExists(id)) || (await this.isCartClosed(id))) {
      throw new HttpException(
        `Cart with ID ${id} doesen't exist, or closed!`,
        HttpStatus.NOT_FOUND,
      );
    }
    const citem = await this.cartitems.findBy({ id: pid });
    await this.cartitems.remove(citem);
    return this.updateCart(id);
  }

  private async addCart(cart: Cart, data: InsertCartDto) {
    if (await this.cartitems.findBy({ pid: data.pid })) {
      throw new HttpException(
        `Course, or tutorial with this ${data.pid} already exists!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const content = await this.findContent(data.pid);
    if (!content) {
      throw new HttpException(
        `Course, or tutorial with this ${data.pid} does'nt exists!`,
        HttpStatus.NOT_FOUND,
      );
    }
    const cItem = this.cartitems.create({
      pid: data.pid,
      price: content.price,
      cart: cart,
    });
    return this.cartitems.save(cItem);
  }
  private async findContent(id: string) {
    const [course, tutorial] = await Promise.all([
      this.courseService.getCourse(id),
      this.tutorialService.getTutorial(id),
    ]);
    let result!: ICartContent;
    if (course) {
      result = { price: course.price };
    } else if (tutorial) {
      result = { price: tutorial.price };
    }
    return result;
  }
}
