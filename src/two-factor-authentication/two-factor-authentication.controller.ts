import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthenticationService } from 'src/authentication/authentication.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationCodeDto } from './dto/TwoFactorAuthenticationCode.dto';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
    private readonly authenticationService: AuthenticationService,
  ) {}

  @Post('authenticate')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(
      request.user.id,
      true,
    );

    request.res.setHeader('Set-Cookie', [accessTokenCookie]);

    return request.user;
  }

  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  async turnOnTwoFactorAuthentication(
    @Req() request: RequestWithUser,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
      twoFactorAuthenticationCode,
      request.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.usersService.turnOnTwoFactorAuthentication(request.user.id);
  }

  @Post('generate')
  @UseGuards(JwtAuthenticationGuard)
  async register(@Res() response: Response, @Req() request: RequestWithUser) {
    const {
      otpauthUrl,
    } = await this.twoFactorAuthenticationService.generateTwoFactoryAuthenticationSecret(
      request.user,
    );
    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }
}
