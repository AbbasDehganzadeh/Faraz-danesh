import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { CourseService } from 'src/content/course.service';
import { TutorialService } from 'src/content/tuturial.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartDto, discountCartDto } from './dtos/cart.dto';
import { InsertCartDto } from './dtos/cart-item.dto';
import { CartStatus } from 'src/common/enum/cart-status.enum';

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
  async createCart(data: CreateCartDto) {
    const userid = data.userId;
    if (await this.getOpenCart(userid)) {
      throw new HttpException(
        `User has an open cart with ID ${userid}!`,
        HttpStatus.CONFLICT,
      );
    }
    const user = await this.userService.getUserById(userid);
    const cart = this.carts.create({
      user: user ?? {},
      totalPrice: 1000, //! dummy data
    });
    await this.carts.save(cart);
    data.items.forEach((data) => {
      this.addCart(cart, data);
    });
    return cart;
  }
  async discountCart(id: number, data: discountCartDto) {
    if (!(await this.IsCartExists(id)) || (await this.IsCartClosed(id))) {
      throw new HttpException(
        `Cart with ID ${id} doesen't exist, or closed!`,
        HttpStatus.BAD_REQUEST,
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
    const cart = await this.carts.findBy({ id: id, status: CartStatus.Open });
    return this.carts.remove(cart);
  }

  private async getOpenCart(uid: number) {
    const cart = await this.carts.findOne({
      relations: { user: true },
      where: { status: CartStatus.Open, user: { id: uid } },
    });
    return cart;
  }
  private IsCartExists(id: number) {
    return this.carts.exists({ where: { id: id } });
  }
  private async IsCartClosed(id: number) {
    return this.carts.exists({
      where: { id: id, status: CartStatus.Close },
    });
  }

  async insertCart(id: number, data: InsertCartDto) {
    if (!(await this.IsCartExists(id)) || (await this.IsCartClosed(id))) {
      throw new HttpException(
        `Cart with ID ${id} doesen't exist, or closed!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const cart = await this.carts.findOneBy({ id: id });
    return this.addCart(cart!, data);
  }
  async removeCart(id: number, pid: number) {
    if (!(await this.IsCartExists(id)) || (await this.IsCartClosed(id))) {
      throw new HttpException(
        `Cart with ID ${id} doesen't exist, or closed!`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const citem = await this.cartitems.findBy({ id: pid });
    return this.cartitems.remove(citem);
  }

  private async addCart(cart: Cart, data: InsertCartDto) {
    const product = await this.findProduct(data.pid);
    if (!product) {
      throw new HttpException(
        `Course, or tutorial with this ${data.pid} does'nt exists!`,
        HttpStatus.NOT_FOUND,
      );
    }
    const cItem = this.cartitems.create({
      pid: data.pid,
      price: product.price, //! dummy data
      cart: cart,
    });
    return this.cartitems.save(cItem);
  }
  private async findProduct(id: string) {
    const [course, tutorial] = await Promise.all([
      this.courseService.getCourse(id),
      this.tutorialService.getTutorial(id),
    ]);
    let result!: { price: number };
    if (course) {
      result = { price: course.price };
    } else if (tutorial) {
      result = { price: tutorial.price };
    }
    return result;
  }
}
