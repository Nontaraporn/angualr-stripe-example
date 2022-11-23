import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { stripe_test_key, BASE_URL } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeApiService {
  
  constructor(
    private http: HttpClient
  ) {}

  getHeader() {
    const stripe = stripe_test_key;
    const token = 'Bearer ' + stripe;
    const header = new HttpHeaders({
      Authorization: token,
    });
    return header;
  }

  getAllProducts() {
    const header = this.getHeader();
    const url = BASE_URL + '/v1/products?limit=100&active=true';
    return this.http.get(url, { headers: header });
  }

  createProduct(point: string) {
    const header = this.getHeader();
    const body = new HttpParams()
      .set('name', `BOTNOI Voice Point ${point}PT`)
      .set('active', 'true');
    const url = BASE_URL + '/v1/products';
    return this.http.post(url, body, { headers: header });
  }

  createPrice(productId: string, price: number) {
    const header = this.getHeader();
    const body = new HttpParams()
      .set('product', productId)
      .set('billing_scheme', 'per_unit')
      .set('currency', 'thb')
      .set('active', 'true')
      .set('unit_amount_decimal', `${price}00`);
    const url = BASE_URL + '/v1/prices';
    return this.http.post(url, body, { headers: header });
  }

  updateProduct(productId: string, update: any) {
    const header = this.getHeader();
    const body = new HttpParams().set('default_price', update);
    const url = BASE_URL + '/v1/products/' + productId;
    return this.http.post(url, body, { headers: header });
  }

  createCheckoutSession(priceId: any) {
    const header = this.getHeader();
    const body = new HttpParams()
      .set('mode', 'payment')
      .set('line_items[0][price]', priceId)
      .set('line_items[0][quantity]', '1')
      .set('success_url', `${window.location.href}`)
      .set('cancel_url', `${window.location.href}`);
    const url = BASE_URL + '/v1/checkout/sessions';
    return this.http.post(url, body, { headers: header });
  }

}
