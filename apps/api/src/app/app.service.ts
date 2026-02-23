import { Injectable } from '@nestjs/common';
import { User } from '@wegrowupupup/datatypes';

@Injectable()
export class AppService {
  getData(): User {
    return {
      id: '1',
      name: 'john doe',
      email: 'john.doe@example.com',
      password: 'password',
    };
  }
}
