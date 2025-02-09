import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrlProducts = 'http://localhost:9999/api/v1/products';
  private productsUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getProducts(filters: any): Observable<any> {
    return this.http.get<any[]>(
      `${this.apiUrlProducts}?nameProduct=${filters.productName}&page=${filters.currentPage}&inventory=${filters.inventory}&size=${filters.pageSize}`
    );
  }

  reloadProducts() {
    this.productsUpdated.next(); // ✅ Émet un événement quand la liste doit être rechargée
  }

  getProductsUpdateListener() {
    return this.productsUpdated.asObservable();
  }
}
