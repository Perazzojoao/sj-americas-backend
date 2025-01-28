import { SetMetadata } from '@nestjs/common';

/** Decorator to mark a route as public, skipping the authentication middleware. */

export const PublicRoute = () => SetMetadata('public-route', true);