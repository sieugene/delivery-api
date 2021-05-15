import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  content: string;
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  addition: string[];
}
