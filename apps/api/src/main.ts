import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * NEW IMPORTS EXPLAINED:
 *
 * DocumentBuilder:
 *   - A builder pattern class for configuring Swagger document metadata
 *   - Sets title, description, version, auth schemes, etc.
 *   - Like configuring the "header" of your API documentation
 *
 * SwaggerModule:
 *   - Creates the OpenAPI document from your NestJS app
 *   - Sets up the Swagger UI route
 *   - Scans all controllers and DTOs for decorators
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Global Validation Pipe
   *
   * This is what makes your DTO decorators (@IsEmail, @MinLength, etc.) work!
   *
   * Options:
   * - whitelist: true → strips properties not in the DTO (security!)
   * - forbidNonWhitelisted: true → throws error if extra properties sent
   * - transform: true → automatically converts types (e.g., string "1" → number 1)
   *
   * Without this pipe, your DTOs are just TypeScript types with no runtime validation.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,           // Remove properties not in DTO
      forbidNonWhitelisted: true, // Error if unknown properties sent
      transform: true,           // Auto-transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Enable CORS for frontend apps
  app.enableCors({
    origin: [
      'http://localhost:3000',     // web app
      'http://localhost:3001',     // admin app
      process.env.WEB_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  /**
   * SWAGGER SETUP
   *
   * DocumentBuilder uses the Builder Pattern:
   * - Chain methods to configure, then call .build()
   * - Each method returns `this` for chaining
   *
   * The config creates metadata for your API documentation.
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('ayyaz.dev API')                    // API title shown in docs
    .setDescription(`
      Portfolio API for ayyaz.dev

      ## Authentication
      Most endpoints are public. Protected endpoints require a JWT token.

      ## Getting Started
      1. Create a user via POST /api/users
      2. Login via POST /api/auth/login to get a token
      3. Use the token in the Authorize button above
    `)
    .setVersion('1.0')                            // API version
    .addBearerAuth(                               // Add JWT auth to Swagger UI
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token',
      },
      'JWT-auth',                                 // Security scheme name
    )
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addTag('projects', 'Portfolio projects')
    .addTag('technologies', 'Technology tags for projects')
    .addTag('skills', 'Technical skills and proficiency levels')
    .addTag('experience', 'Work experience entries')
    .build();

  /**
   * Create the OpenAPI document
   *
   * SwaggerModule.createDocument():
   * - Scans all controllers in your app
   * - Reads decorators (@ApiProperty, @ApiOperation, etc.)
   * - Generates OpenAPI 3.0 spec
   */
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  /**
   * Serve Swagger UI
   *
   * SwaggerModule.setup(path, app, document):
   * - First arg: URL path for the docs (relative to prefix)
   * - Since we have prefix 'api', docs will be at /api/docs
   */
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,  // Remember auth token across page refreshes
    },
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);

  console.log(`🚀 API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}
bootstrap();
