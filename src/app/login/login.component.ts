import { Component, signal  } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { HttpService } from '../services/http.service';
import { TokenService } from '../services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
 LoginSignal = signal(false);
  constructor(private fb: FormBuilder,
              private router: Router, 
              public httpService:HttpService, 
              public tokenService:TokenService,
              public snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    this.loginForm.statusChanges.subscribe(() => {
      this.LoginSignal.set(this.loginForm.valid);
    });
  }
  navigateToSignin() {
    this.router.navigate(['/signin']);
  }
  onSubmit() {
    if (this.loginForm.valid) {    
      const body = this.loginForm.value
      this.httpService.authControl(body).subscribe(response => {
        if (response?.access_token) {
          this.tokenService.setToken(response.access_token); 
          this.router.navigate(['/documents']);

        }
        else {
          this.snackBar.open('Wrong email or password', 'Close', {
            duration: 3000,
            panelClass: ['mat-err'],
          });
        }
      },
      error => {
        const errorMessage = error?.error?.message || 'An error occurred during registration.';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
          panelClass: ['mat-warn'],
        });
      });
    }
  }
}