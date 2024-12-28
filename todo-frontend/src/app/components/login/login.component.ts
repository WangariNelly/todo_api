import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Logged in successfully:', response);
          this.router.navigate(['/todos']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          alert('Login failed. Please check your credentials.');
        },
      });
    }
  }

  redirectToSignup(): void {
    this.router.navigate(['/register']); // Navigate to the sign-up page
  }

  redirectToForgotPassword(): void {
    this.router.navigate(['/forgot-password']); // Navigate to the forgot password page
  }
}