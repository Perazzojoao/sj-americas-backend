import { HttpStatus } from '@nestjs/common';

export interface HttpResponse {
  statusCode: HttpStatus;
  message: string;
  data: unknown;
}

export class DefaultResponse {
  public success(data: unknown, message: string, statusCode?: HttpStatus) {
    if (!statusCode) {
      statusCode = HttpStatus.OK;
    }

    return {
      statusCode,
      message,
      data,
    };
  }
}
