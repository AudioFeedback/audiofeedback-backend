import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { importX509, jwtVerify } from "jose";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string): Promise<any> {
    const user = await this.usersService.findOne({ username: username });

    if (user) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: string) {
    const publicKeys = await (
      await fetch(
        "https://www.googleapis.com/service_accounts/v1/metadata/x509/securetoken@system.gserviceaccount.com",
      )
    ).json();

    const decodedToken = await jwtVerify(
      user,
      async (header) => {
        const x509Cert = publicKeys[header.kid];
        return await importX509(x509Cert, "RS256");
      },
      {
        issuer: `https://securetoken.google.com/${process.env.FIREBASE_PROJECT_ID}`,
        audience: process.env.FIREBASE_PROJECT_ID,
        algorithms: ["RS256"],
      },
    );

    const signedUser = await this.usersService.findOne({
      sub: decodedToken.payload.sub,
    });

    const payload = { sub: signedUser.username, roles: signedUser.roles };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
