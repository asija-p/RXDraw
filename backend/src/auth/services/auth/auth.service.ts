import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.users.findAuthByName(username);
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) return null;
    const { passwordHash, ...safe } = user;
    return safe;
  }

  login(user: { id: string; name: string }) {
    const payload = { sub: user.id, name: user.name };
    return {
      user,
      access_token: this.jwt.sign(payload),
    };
  }
}
