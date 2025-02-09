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
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-list-products',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
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
  cartCount = 0;
  paginationData: any;
  totalPages: any;
  totalElements: any;
  pageNumber: any;
  first: any;
  last: any;
  private productsSub: Subscription = new Subscription();
  totalShoppedProduct = 0;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cartService: CartService
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

  addToCart() {
    this.cartCount++;
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
}
