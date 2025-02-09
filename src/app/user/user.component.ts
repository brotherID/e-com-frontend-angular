import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common'; // pour les directives ngif , ....
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  title = 'my ecommerce site';

  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('userForm.valid : ', this.userForm.valid);
    if (this.userForm.valid) {
      console.log('Données envoyées : ', this.userForm.value);
      this.userService.addUser(this.userForm.value).subscribe({
        next: (response: any) => {
          console.log('✅ Utilisateur ajouté avec succès', response);
          alert('Utilisateur ajouté avec succès ✅');
          this.router.navigate(['/users']);
        },
        error: (error: any) => {
          console.error("❌ Erreur lors de l'ajout de l'utilisateur", error);
          alert("Erreur lors de l'ajout ❌");
        },
      });
    } else {
      console.log('❌ Formulaire invalide');
      alert('Veuillez remplir correctement le formulaire');
    }
  }
}
