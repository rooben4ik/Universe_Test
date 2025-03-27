import { Component,signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { HttpService } from '../services/http.service';
import { TokenService } from '../services/token.service';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {  registerForm: FormGroup;
  SigninSignal = signal(false);
  constructor(public fb: FormBuilder,
              public router: Router,
              public httpService:HttpService,
              public tokenService: TokenService,
              public snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      fullName: ['', [Validators.required]],
      role: ['USER', [Validators.required]]
    });
    this.registerForm.statusChanges.subscribe(() => {
      this.SigninSignal.set(this.registerForm.valid);
    });
  }


  onRegister(): void {
      this.httpService.registerUser(this.registerForm.value).subscribe(
        response => {
          if (response) {
            this.router.navigate(['/login']);
            this.snackBar.open('Now you just need login', 'Close', {
              duration: 3000,
              panelClass: ['mat-acces'],
            });
          } else {
            this.snackBar.open('The email is already registered. Please try another one.', 'Close', {
              duration: 3000,
              panelClass: ['mat-warn'],
            });
          }
        },
        error => {
          const errorMessage = error?.error?.message || 'An error occurred during registration.';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
            panelClass: ['mat-warn'],
          });
        }
      );

    
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}