import { LoggerService } from '@nestjs/common';

export class YourLogger implements LoggerService {
  log(message: string) {
    console.log(message);
  }

  error(message: string, trace: string) {
    console.error(message, trace);
  }

  warn(message: string) {
    console.warn(message);
  }

  debug(message: string) {
    console.debug(message);
  }

  verbose(message: string) {
    console.log(message);
  }
}
