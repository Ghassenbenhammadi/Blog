import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './service/auth.service';
import { RolesGuard } from './guards/roles.guard';
import { JWTAuthGuard } from './guards/jwt-guard';
import { JwtStrategy } from './guards/jwt-strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        forwardRef(()=> UserModule),
        JwtModule.registerAsync({
            imports:[ConfigModule],
            inject:[ConfigService],
            useFactory: async (configService: ConfigService) =>({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: '10000s'}
            })

        })
    ],
    providers: [AuthService, RolesGuard, JWTAuthGuard, JwtStrategy],
    exports: [AuthService]
})
export class AuthModule {}
