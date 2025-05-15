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
    const user = await this.userService.getUserById(data.userId);
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
  discountCart(id: number, code: discountCartDto) {
    console.info({ code });
    return `Cart ${id} Off!!!`;
  }
  async destroyCart(id: number) {
    const cart = await this.carts.findBy({ id: id });
    return this.carts.remove(cart);
  }

  async insertCart(id: number, data: InsertCartDto) {
    try {
      const cart = await this.carts.findOneByOrFail({ id: id });
      if (cart) {
        return this.addCart(cart, data);
      }
    } catch (err) {
      console.info(err.message);
      if (err instanceof EntityNotFoundError) {
        throw new HttpException(
          `Cart with ${id} not found!`,
          HttpStatus.NOT_FOUND,
        );
      }
    }
  }
  async removeCart(id: number, pid: number) {
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
