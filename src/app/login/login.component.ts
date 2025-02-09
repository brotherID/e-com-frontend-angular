import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log('valid : ', this.loginForm.valid);
    if (this.loginForm.valid) {
      console.log('value : ', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          console.log('here token : ', localStorage.getItem('authToken'));
          console.log('✅ Authentification réussie');
          this.router.navigate(['/list-products']);
        },
        error: (err) => {
          console.error("❌ Erreur d'authentification", err);
        },
      });
    }
  }
}
