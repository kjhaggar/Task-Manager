import { Injectable } from '@angular/core';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private webService: WebService) {}

  getUsers() {
    return this.webService.get('user');
  }

  getUserById(userId: string) {
    return this.webService.get(`user/${userId}`);
  }

  postUser(body: object) {
    return this.webService.post('user', body);
  }

  deleteUser(userId: string) {
    return this.webService.delete(`user/${userId}`);
  }

  loginUser(body: object) {
    return this.webService.post('user/login', body);
  }
}
