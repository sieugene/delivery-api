import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import ObjectWithIdDTO from 'src/utils/types/objectWithId.dto';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateNested()
  @Type(() => ObjectWithIdDTO)
  product: ObjectWithIdDTO;
}
export default CreateCommentDto;
