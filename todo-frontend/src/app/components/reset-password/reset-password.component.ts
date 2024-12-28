import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.services';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})

export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', Validators.required],
    });

    this.token = this.route.snapshot.paramMap.get('token')!;
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      this.authService.resetPassword(this.token, this.resetPasswordForm.value).subscribe({
        next: (response) => {
          console.log('Password reset successfully:', response);

          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Failed to reset password:', error);
        },
      });
    }
  }
}
