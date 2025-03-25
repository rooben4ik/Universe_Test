import { Component,signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { HttpService } from '../http.service';
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
    
  ],
  
  providers: [HttpService],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent {  registerForm: FormGroup;
  SigninSignal = signal(false);

  constructor(private fb: FormBuilder,
              private router: Router,
              public httpService:HttpService
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
  ngOnInit(){
    const body ={
      email: "user@example.com",
      password: "string"
    }
    this.httpService.authControl(body).subscribe(response => {
      console.log(response); 
    });
  }
  onRegister(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      console.log('Registration data:', formData);

      // this.router.navigate(['/login']);

    } else {
      console.log('Form is invalid');
    }
  }
  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}