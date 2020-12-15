import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WebService {
  rootUrl = '';

  constructor(private httpClient: HttpClient) {
    this.rootUrl = 'http://localhost:3000';
  }

  get(uri: string) {
    return this.httpClient.get(`${this.rootUrl}/${uri}`);
  }

  post(uri: string, payload: object) {
    return this.httpClient.post(`${this.rootUrl}/${uri}`, payload);
  }

  patch(uri: string, payload: object) {
    return this.httpClient.patch(`${this.rootUrl}/${uri}`, payload);
  }

  delete(uri: string) {
    return this.httpClient.delete(`${this.rootUrl}/${uri}`);
  }
}
