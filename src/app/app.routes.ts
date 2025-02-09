import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { ListProductsComponent } from './list-products/list-products.component';

export const routes: Routes = [
  { path: '', redirectTo: '', pathMatch: 'full' }, // ✅ Redirection par défaut
  { path: 'users', component: UserListComponent }, // ✅ Page Liste des utilisateurs
  { path: 'add-user', component: UserComponent }, // ✅ Page Ajouter un utilisateur
  { path: 'login', component: LoginComponent },
  { path: 'list-products', component: ListProductsComponent },
];
