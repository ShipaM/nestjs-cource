import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth-dto.js';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, UserModel } from './user.model.js';
import { Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  ALREADY_REGISTERED_ERROR,
  USER_NOT_FOUND_ERROR,
  INCORRECT_PASSWORD_ERROR,
} from './auth.constants.js';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(dto: AuthDto) {
    const oldUser = await this.findUserByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }

    const salt = await bcrypt.genSalt(10);

    const newUser = new this.userModel({
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, salt),
    });

    await newUser.save();

    return { _id: newUser._id, email: newUser.email };
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(dto: AuthDto): Promise<Pick<UserDocument, 'email'>> {
    const user = await this.findUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }

    const isValidPassword = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(INCORRECT_PASSWORD_ERROR);
    }

    return { email: user.email };
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
