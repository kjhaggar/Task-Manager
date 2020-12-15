import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errMsg = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    this.userService.loginUser(this.form.value).subscribe(
      (data) => {
        this.authService.storeUserData(data);
        this.router.navigate(['/dashboard']);
      },
      (err) => {
        this.displayMessage(err.error.message);
      }
    );
  }

  displayMessage(msg: string) {
    this.errMsg = msg;
    setTimeout(() => {
      this.errMsg = '';
    }, 7000);
  }
}
