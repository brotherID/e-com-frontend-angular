import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common'; // pour les directives ngif , ....

@Component({
  selector: 'app-user-list',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des utilisateurs', error);
      },
    });
  }
}
