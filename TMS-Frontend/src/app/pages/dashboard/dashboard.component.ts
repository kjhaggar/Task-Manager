import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';
import { List } from 'src/app/core/services/models/list';
import { Task } from 'src/app/core/services/models/task';
import { TaskService } from 'src/app/core/services/task.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lists: Array<List> = [];
  tasks: Array<Task> = [];
  form: FormGroup;
  active = 0;
  errorMsg = '';
  modelType = '';
  currentListId = '';
  users = [];
  editProjT = [];
  editTaskT = [];
  statusList = ['Pending', 'In Progress', 'Completed'];
  userRole = '';
  userDetail: any;

  constructor(
    private taskService: TaskService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    if (this.userRole === 'admin') {
      this.loadProjectList();
      this.buildListForm();
    } else {
      this.loadUsersProject();
      this.getUserInfo();
    }
  }

  buildListForm() {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  getUserInfo() {
    const id = this.authService.getUserId();
    this.userService.getUserById(id).subscribe(
      (data) => {
        this.userDetail = data;
      },
      (error) => console.log(error)
    );
  }

  loadUsersProject() {
    const id = this.authService.getUserId();
    this.taskService.getUsersProj(id).subscribe(
      (data: List[]) => {
        if (data.length) {
          this.lists = data;
          this.currentListId = this.lists[0].pid;
          this.loadTasks();
          this.getUsersList();
        }
      },
      (err) => console.log(err)
    );
  }

  loadProjectList() {
    this.taskService.getAllProjects().subscribe(
      (data: List[]) => {
        this.lists = data;
        this.currentListId = this.lists[0]._id;
        this.loadTasks();
        this.getUsersList();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  loadTasks() {
    this.taskService.getAllTasks(this.currentListId).subscribe(
      (data: Task[]) => {
        this.tasks = data;
      },
      (err) => console.log(err)
    );
  }

  getUsersList() {
    this.userService.getUsers().subscribe(
      (data: any) => {
        this.users = data.filter((user) => user.role !== 'admin');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectProject(event: number) {
    this.editProjT = [];
    this.editTaskT = [];
    if (this.lists[event]) {
      this.currentListId =
        this.userRole === 'admin'
          ? this.lists[event]._id
          : this.lists[event].pid;
    } else {
      this.currentListId =
        this.userRole === 'admin' ? this.lists[0]?._id : this.lists[0]?.pid;
    }
    this.loadTasks();
  }

  openModel(content, type: string) {
    this.modelType = type;
    this.modalService.open(content);
  }

  add() {
    if (this.modelType === 'Task') {
      this.addTask();
    } else {
      this.addProject();
    }
  }

  addTask() {
    this.taskService
      .createTask(this.currentListId, this.form.value.title)
      .subscribe(
        (data: any) => {
          if (!data.errors) {
            this.tasks.push(data);
            this.modalService.dismissAll();
            this.form.reset();
            this.errorMsg = '';
          } else {
            this.errorMsg = data.message;
          }
        },
        (err) => {
          console.log(err);
          this.modalService.dismissAll();
          this.form.reset();
        }
      );
  }

  addProject() {
    this.taskService.createProject(this.form.value.title).subscribe(
      (data: any) => {
        if (!data.errors) {
          this.lists.push(data);
          this.modalService.dismissAll();
          this.form.reset();
          this.errorMsg = '';
        } else {
          this.errorMsg = data.message;
        }
      },
      (err) => {
        console.log(err);
        this.modalService.dismissAll();
        this.form.reset();
      }
    );
  }

  toggleUser(e: MouseEvent, user: any, taskId: string) {
    /* tslint:disable:no-string-literal */
    const obj = {
      listId: this.currentListId,
      taskId,
      name: user.firstName + ' ' + user.lastName,
      _userId: user._id,
      email: user.email,
    };
    const filterTask = this.tasks.find((i) => i._id === taskId);

    if (e.target['checked']) {
      this.taskService.assignUser(obj).subscribe(
        (data) => {
          filterTask.assignedTo.push({
            name: user.firstName + ' ' + user.lastName,
            _userId: user._id,
            email: user.email,
          });
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      this.taskService.removeUser(obj).subscribe(
        (data) => {
          const index = filterTask.assignedTo.findIndex(
            (task) => task._userId === user._id
          );
          if (index > -1) {
            filterTask.assignedTo.splice(index, 1);
          }
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  filterName(arr) {
    const filtered = arr.reduce((a, o) => (a.push(o.name), a), []);
    return filtered;
  }

  isChecked(arr, id) {
    const filter = arr.filter((user) => {
      return user._userId === id;
    });
    if (filter.length) {
      return true;
    }
    return false;
  }

  toggleEditInput(index: number) {
    this.editTaskT = [];
    this.editProjT = [];
    this.editProjT[index] = true;
  }

  toggleTaskEditInput(index: number) {
    this.editProjT = [];
    this.editTaskT = [];
    this.editTaskT[index] = true;
  }

  editListTitle(list: List, newTitle: string) {
    if (newTitle.length < 3) {
      return;
    } else {
      this.taskService.updateProject(list._id, { title: newTitle }).subscribe(
        (data) => {
          const filterTask = this.lists.find((i) => i._id === list._id);
          filterTask.title = newTitle;
          this.editProjT = [];
          this.editTaskT = [];
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  editTaskTitle(task: Task, newTitle: string) {
    if (newTitle.length < 3) {
      return;
    } else {
      this.taskService
        .updateTask(this.currentListId, task._id, { title: newTitle })
        .subscribe(
          (data) => {
            const filterTask = this.tasks.find((i) => i._id === task._id);
            filterTask.title = newTitle;
            this.editProjT = [];
            this.editTaskT = [];
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  removeTask(taskId: string) {
    this.taskService.deleteTask(this.currentListId, taskId).subscribe(
      (data) => {
        this.tasks = this.tasks.filter((task) => task._id !== taskId);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  updateTaskStatus(task: Task, status: string) {
    this.taskService
      .updateTask(this.currentListId, task._id, { status })
      .subscribe(
        (data) => {
          const filterTask = this.tasks.find((i) => i._id === task._id);
          filterTask.status = status;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  navigate() {
    this.router.navigate(['/members']);
  }
}
