import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductNotFoundException extends HttpException {
  constructor(productId: number) {
    super(`Product with id ${productId} not found`, HttpStatus.NOT_FOUND);
  }
}
