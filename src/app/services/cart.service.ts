import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private totalShoppedProductSource = new BehaviorSubject<number>(0); // Initialise à 0
  totalShoppedProduct = this.totalShoppedProductSource.asObservable(); // Observable public

  private apiUrlCart = 'http://localhost:9999/api/v1/products';

  constructor(private http: HttpClient) {}

  addToCart(idProduct: number, quantity: number): Observable<any> {
    return this.http.post(
      `${this.apiUrlCart}/${idProduct}/quantityRequested/${quantity}/cart`,
      {}
    );
  }

  updateTotalShoppedProduct(total: number) {
    this.totalShoppedProductSource.next(total);
  }
}
