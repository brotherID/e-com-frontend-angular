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
  private apiUrlPromotion = 'http://localhost:9999/api/v1/promotions';

  constructor(private http: HttpClient) {}

  addToCart(idProduct: number, quantity: number): Observable<any> {
    return this.http.post(
      `${this.apiUrlCart}/${idProduct}/quantityRequested/${quantity}/cart`,
      {}
    );
  }

  getCartUser(): Observable<any> {
    return this.http.get<any>(this.apiUrlCart + '/cart-user');
  }

  updateTotalShoppedProduct(total: number) {
    //localStorage.setItem('totalShoppedProduct', total.toString());
    if (total > 0) {
      localStorage.setItem('totalShoppedProduct', total.toString());
    } else {
      localStorage.removeItem('totalShoppedProduct'); // ✅ Supprime `localStorage` si total = 0
    }

    this.totalShoppedProductSource.next(total);
  }

  applyPromoCode(promoCode: string): Observable<any> {
    return this.http.get<any>(this.apiUrlPromotion + `/discount/${promoCode}`);
  }
}
