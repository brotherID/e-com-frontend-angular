import { Component } from '@angular/core';
import { MatLabel } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-addproduct-modal',
  imports: [MatLabel, MatDialogModule, MatButton],
  templateUrl: './addproduct-modal.component.html',
  styleUrl: './addproduct-modal.component.css',
})
export class AddproductModalComponent {
  constructor() {}
}
