import { Injectable } from '@angular/core';
import { Task } from './models/task';
import { WebService } from './web.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webService: WebService) {}

  getAllProjects() {
    return this.webService.get('api/lists');
  }

  updateProject(listId: string, body: object) {
    return this.webService.patch(`api/lists/${listId}`, body);
  }

  createProject(title: string) {
    return this.webService.post('api/lists', { title });
  }

  deleteProject(listId: string) {
    return this.webService.delete(`api/lists/${listId}`);
  }

  getUsersProj(userId: string) {
    return this.webService.get(`user/list/${userId}`);
  }

  getAllTasks(listId: string) {
    return this.webService.get(`api/lists/${listId}/tasks`);
  }

  createTask(listId: string, title: string) {
    return this.webService.post(`api/lists/${listId}/tasks`, { title });
  }

  updateTask(listId: string, taskId: string, body: object) {
    return this.webService.patch(`api/lists/${listId}/tasks/${taskId}`, body);
  }

  deleteTask(listId: string, taskId: string) {
    return this.webService.delete(`api/lists/${listId}/tasks/${taskId}`);
  }

  assignUser(body: object) {
    return this.webService.patch('api/tasks/addUser', body);
  }

  removeUser(body: object) {
    return this.webService.patch('api/tasks/removeUser', body);
  }
}
