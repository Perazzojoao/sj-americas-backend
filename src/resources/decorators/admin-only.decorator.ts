import { SetMetadata } from '@nestjs/common';

export const AdminOnly = () => SetMetadata('admin-only', true);
