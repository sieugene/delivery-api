import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailScheduleDto {
  @IsEmail()
  recipent: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  date: string;
}
export default EmailScheduleDto;
