import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  users = [];
  adminProfile: any;
  form: FormGroup;
  successMsg = '';
  userRole = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    if (this.userRole !== 'admin') {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.getUsersList();
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  navigate() {
    this.router.navigate(['/dashboard']);
  }

  getUsersList() {
    this.userService.getUsers().subscribe(
      (data: any) => {
        this.adminProfile = data.filter((user) => user.role === 'admin')[0];
        this.users = data.filter((user) => user.role !== 'admin');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addUser() {
    const values = this.form.value;
    this.userService.postUser(values).subscribe(
      (data) => {
        this.users.push(values);
        this.form.reset();
        this.displayMsg('Successfully added new user!');
      },
      (err) => {
        console.log(err);
      }
    );
  }

  displayMsg(message: string) {
    this.successMsg = message;
    setTimeout(() => {
      this.successMsg = '';
    }, 7000);
  }

  removeUser(user: any) {
    this.userService.deleteUser(user._id).subscribe(
      (data) => {
        this.users = this.users.filter((u) => u._id !== user._id);
        this.displayMsg('Successfully deleted user!');
      },
      (err) => console.log(err)
    );
  }
}
