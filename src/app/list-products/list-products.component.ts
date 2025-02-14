import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../services/cart.service';
import { Offcanvas } from 'bootstrap';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddproductModalComponent } from '../addproduct-modal/addproduct-modal.component';

@Component({
  selector: 'app-list-products',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.css',
})
export class ListProductsComponent {
  products: any[] = [];
  filterForm: FormGroup;
  productName = new FormControl('');
  inventory = new FormControl('');
  pageSize = new FormControl(10);
  currentPage = 0;
  paginationData: any;
  totalPages: any;
  totalElements: any;
  pageNumber: any;
  first: any;
  last: any;
  private productsSub: Subscription = new Subscription();
  totalShoppedProduct = 0;
  cartItems: any;
  shoppedProducts: any[] = [];
  totalAmount: any;
  promoCode: string = '';

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cartService: CartService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.filterForm = this.fb.group({
      productName: [''],
      inventory: ['INSTOCK'],
      pageSize: [10],
    });
  }

  ngOnInit() {
    this.getProducts();
    console.log('✅ filterForm avant valueChanges:', this.filterForm.value);
    this.filterForm.valueChanges.subscribe((values) => {
      console.log('🔄 Filtres modifiés:', values);
      this.getProducts();
    });

    this.totalShoppedProduct = Number(
      localStorage.getItem('totalShoppedProduct')
    );
    this.cartService.updateTotalShoppedProduct(this.totalShoppedProduct);

    // Écouter les changements du service CartService
    this.cartService.totalShoppedProduct.subscribe((total) => {
      this.totalShoppedProduct = total;
      console.log(
        "🛒 Nombre total d'articles dans le panier :",
        this.totalShoppedProduct
      );
    });

    // ✅ Écoute les mises à jour des produits
    this.productsSub = this.productService
      .getProductsUpdateListener()
      .subscribe(() => {
        this.getProducts();
      });

    this.authService.autoLogout();
  }

  getProducts() {
    const filters = this.filterForm.value;
    filters.currentPage = this.currentPage;
    this.productService.getProducts(filters).subscribe({
      next: (data) => {
        console.log('✅ Données reçues:', data);
        this.paginationData = data.pageable;
        this.pageNumber = this.paginationData.pageNumber;
        this.totalPages = data.totalPages;
        this.first = data.first;
        this.last = data.last;
        this.totalElements = data.totalElements;
        this.products = data.content;
        console.log('✅ Produits récupérés:', this.products);
      },
      error: (err) =>
        console.error('❌ Erreur lors de la récupération des produits', err),
    });
  }

  getTotalElements() {
    this.totalElements;
  }

  getTotalPages() {
    return Array(this.totalPages)
      .fill(0)
      .map((x, i) => i + 1);
  }

  onPageChange(pageNo: number) {
    console.log('pageNo : ', pageNo);
    this.currentPage = pageNo;
    this.getProducts();
  }

  //

  openModal(product: any) {
    this.dialog.open(ProductModalComponent, {
      data: { product },
      //width: '600px',
      //height: '271px',
    });
  }

  openCart() {
    console.log('🎯 Button clicked - Opening Cart');

    this.cartService.getCartUser().subscribe({
      next: (response) => {
        console.log('✅ Cart Items:', response);
        this.cartItems = response;
        this.shoppedProducts = this.cartItems.shoppedProducts;
        this.totalAmount = this.cartItems.totalAmount;
        this.totalShoppedProduct = this.cartItems.totalShoppedProduct;
        if (this.totalShoppedProduct === 0) {
          localStorage.removeItem('totalShoppedProduct');
        }
      },
      error: (error) => {
        console.error('❌ Erreur lors de la récupération du panier:', error);
      },
    });

    const offcanvasElement = document.getElementById('cartOffcanvas');
    if (offcanvasElement) {
      const bsOffcanvas = new Offcanvas(offcanvasElement);
      bsOffcanvas.show();
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

  applyPromoCode() {
    if (!this.promoCode.trim()) {
      this.showToast('⚠️ Please enter a promo code!', 'warning');
      return;
    }
    console.log('✅ Applying promo code : ', this.promoCode);
    this.cartService.applyPromoCode(this.promoCode).subscribe({
      next: (response) => {
        this.totalAmount = response;
        console.log(' amount after promotion : ', this.totalAmount);
        this.showToast(
          `✅ ${this.promoCode} Promo code applied successfully! `,
          'success'
        );
      },
      error: (error) => {
        this.showToast(`❌ Invalid promo code. Please try again : `, 'error');
        console.error('❌ Invalid promo code. Please try again :', error);
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authService.clearTimeOut();
  }

  openModalAddProduct() {
    console.log('***** openModalAddProduct');
    this.dialog.open(AddproductModalComponent, {});
  }
}
