import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

/**
 * AuthModule - Authentication feature module
 *
 * This module sets up:
 * - Passport.js for authentication strategies
 * - JWT for token-based auth
 * - Local strategy for login
 * - JWT strategy for protected routes
 *
 * MODULE CONFIGURATION PATTERNS:
 *
 * 1. JwtModule.registerAsync():
 *    - Allows async configuration (reading from ConfigService)
 *    - Better than JwtModule.register() which requires static config
 *    - Follows "12-factor app" principle (config from environment)
 *
 * 2. imports: [UsersModule]:
 *    - Gives access to UsersService (exported by UsersModule)
 *    - AuthService uses UsersService to look up users
 *
 * 3. Strategies as Providers:
 *    - JwtStrategy and LocalStrategy are @Injectable()
 *    - They register themselves with Passport automatically
 */
@Module({
  imports: [
    // Import UsersModule to access UsersService
    UsersModule,

    // Configure Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Configure JWT with async factory
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: {
            // 7 days in seconds (7 * 24 * 60 * 60 = 604800)
            expiresIn: 604800,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,   // Registers with Passport as 'jwt' strategy
    LocalStrategy, // Registers with Passport as 'local' strategy
  ],
  exports: [AuthService], // Export for use in other modules if needed
})
export class AuthModule {}
