import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('Form validity:', this.registerForm.valid);
    console.log('Form values:', this.registerForm.value);
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          console.log('Registered successfully:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          // console.error('Registration failed:', error);
          alert('Registration failed. Please check your details again!.');
        },
      });
    }
    else {
      console.error('Form is invalid:', this.registerForm.errors);
    }
  }
  redirectToLogin(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }
}