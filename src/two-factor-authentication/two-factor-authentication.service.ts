import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from '@otplib/preset-default';
import { Response } from 'express';
import User from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public async generateTwoFactoryAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);
    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, outpauthUrl: string) {
    return toFileStream(stream, outpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: User,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
