import { applyDecorators, UseGuards } from "@nestjs/common";
import { SuperAdminOnlyGuard } from "../guards/super-admin-only/super-admin-only.guard";

export const SuperAdminOnly = () => applyDecorators(UseGuards(SuperAdminOnlyGuard));