import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/registerDto.dto';
import JwtAuthenticationGuard from './jwt-authentication.guard';
import JwtRefreshGuard from './jwtRefreshToken.strategy.guard';

import { LocalAuthenticationGuard } from './localAuthentication.guard';
import RequestWithUser from './requestWithUser.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersSerivce: UsersService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(
      request.user.id,
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const accessTokenCookie = this.authenticationService.getCookieWithJwtAccessToken(
      user.id,
    );
    const {
      cookie: refreshTokenCookie,
      token: refreshToken,
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);
    await this.usersSerivce.setCurrentRefreshToken(refreshToken, user.id);

    request.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);
    if (user.isTwoFactorAuthenticationEnabled) {
      return;
    }
    return user;
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersSerivce.removeRefreshToken(request.user.id);
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser) {
    const user = request.user;
    return user;
  }
}
