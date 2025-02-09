import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-modal',
  imports: [MatDialogModule, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.css',
})
export class ProductModalComponent {
  selectedQuantity = 1; // Quantité par défaut
  isInvalidQuantity = false;
  totalShoppedProduct = 0;

  constructor(
    public dialogRef: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  checkQuantity() {
    if (this.selectedQuantity < 1) {
      this.showToast('❌ La quantité ne peut pas être inférieure à 1', 'error');
      this.selectedQuantity = 1; // ✅ Forcer à 1
      this.isInvalidQuantity = true;
    } else if (this.selectedQuantity > this.data.product.quantityProduct) {
      this.showToast(
        `❌ Stock insuffisant ! Max: ${this.data.product.quantityProduct}`,
        'error'
      );
      this.isInvalidQuantity = true;
      this.selectedQuantity = this.data.product.quantityProduct; // ✅ Limite max
    } else {
      this.isInvalidQuantity = false;
    }
  }

  showToast(message: string, type: string) {
    this.snackBar.open(message, 'OK', {
      duration: 3000, // ✅ Temps d'affichage en ms
      panelClass: type === 'error' ? 'snack-error' : 'snack-success',
      horizontalPosition: 'end', // ✅ Aligné à droite
      verticalPosition: 'top', // ✅ Aligné en haut
    });
  }

  addToCart() {
    console.log('🛒 Produit ajouté au panier:', {
      product: this.data.product,
      quantity: this.selectedQuantity,
    });

    this.cartService
      .addToCart(this.data.product.idProduct, this.selectedQuantity)
      .subscribe({
        next: (data) => {
          console.log('data in addToCart : ', data);
          this.totalShoppedProduct = data.totalShoppedProduct;
          console.log('totalShoppedProduct : ', this.totalShoppedProduct);
          this.cartService.updateTotalShoppedProduct(this.totalShoppedProduct);
          this.showToast(
            '✅ Produit ajouté au panier avec succès !',
            'success'
          );
          // ✅ Recharger la liste des produits
          this.productService.reloadProducts();
          this.dialogRef.close(this.selectedQuantity);
        },
        error: (err) => {
          this.showToast('❌ Erreur lors de l’ajout au panier', 'error');
          console.error('Erreur API Add to Cart:', err);
        },
      });
  }
}
