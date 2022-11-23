import { Component, OnInit } from '@angular/core';
import { formatNumber } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { StripeApiService } from '../services/stripe-api.service';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.scss'],
})
export class CardPaymentComponent implements OnInit {
  inputPointForm = new FormGroup({
    point: new FormControl(0),
    price: new FormControl(0),
  });

  packages = [
    {
      name: '2,500 PT + ได้โบนัสพิเศษ 100 PT(เฉลี่ย 1.92 สตางค์ / PT)',
      price: '50',
      priceId: 'price_1M6pXoEJLQ5PWEXhSZHAWn5M',
    },
    {
      name: '5,000 PT + ได้โบนัสพิเศษ 400 PT(เฉลี่ย 1.85 สตางค์ / PT)',
      price: '100',
      priceId: 'price_1M6sMfEJLQ5PWEXhI7HHhjfu',
    },
    {
      name: '10,000 PT + ได้โบนัสพิเศษ 1,300 PT(เฉลี่ย 1.77 สตางค์ / PT)',
      price: '200',
      priceId: 'price_1M6sRUEJLQ5PWEXh53QDeBBb',
    },
    {
      name: '20,000 PT + ได้โบนัสพิเศษ 3,500 PT(เฉลี่ย 1.70 สตางค์ / PT)',
      price: '400',
      priceId: 'price_1M6sSXEJLQ5PWEXhBz6U7hLT',
    },
    {
      name: '40,000 PT + ได้โบนัสพิเศษ 8,000 PT(เฉลี่ย 1.67 สตางค์ / PT)',
      price: '800',
      priceId: 'price_1M6sStEJLQ5PWEXhvF8PTMR5',
    },
    {
      name: '80,000 PT + ได้โบนัสพิเศษ 25,000 PT(เฉลี่ย 1.52 สตางค์ / PT)',
      price: '1600',
      priceId: 'price_1M6sTLEJLQ5PWEXhJrhjSRuN',
    },
    {
      name: '160,000 PT + ได้โบนัสพิเศษ 75,000 PT(เฉลี่ย 1.36 สตางค์ / PT)',
      price: '3200',
      priceId: 'price_1M6sfiEJLQ5PWEXh0uFAeLVb',
    },
    {
      name: '320,000 PT + ได้โบนัสพิเศษ 220,000 PT(เฉลี่ย 1.19 สตางค์ / PT)',
      price: '6400',
      priceId: 'price_1M6sg6EJLQ5PWEXhgzOIhdd9',
    },
  ];

  constructor(
    private router: Router,
    private _stripe: StripeApiService
  ) {}

  ngOnInit(): void {}

  inputCheckout() {
    const price = this.inputPointForm.value.price;
    const point = this.inputPointForm.value.point;
    const pointStr = formatNumber(point, 'en-US', '1.0');
    if(point != 0) {
      this._stripe.getAllProducts().subscribe((res: any) => {
        const data = res.data;
        console.log(data);
        const product = data.filter((i: any) => {
          return i.name == `BOTNOI Voice Point ${pointStr}PT`;
        });
        console.log(product);
        if (product.length != 0) {
          console.log('exist');
          const priceId: string = product[0].default_price;
          console.log(priceId);
          this._stripe.createCheckoutSession(priceId).subscribe((res: any) => {
            const url: string = res.url;
            console.log(url);
            window.location.href = url;
          });
        } else {
          console.log('create new one');
          this._stripe.createProduct(pointStr).subscribe((res: any) => {
            console.log(res);
            const productId: string = res.id;
            console.log(productId);
            this._stripe.createPrice(productId, price).subscribe((res: any) => {
              const priceId: string = res.id;
              this._stripe.updateProduct(productId, priceId).subscribe(
                (res: any) => {
                  this._stripe.createCheckoutSession(priceId).subscribe(
                    (res: any) => {
                      const url: string = res.url;
                      console.log(url);
                      window.location.href = url;
                    }
                  );
                }
              );
            });
          });
        }
      });
    }
  }

  packageCheckout(priceId: string) {
    this._stripe.createCheckoutSession(priceId).subscribe((res: any) => {
      const url: string = res.url;
      console.log(url);
      window.location.href = url;
    });
  }

  calcalateBaht(point: number) {
    this.inputPointForm.controls['point'].setValue(Math.ceil(Number(point)));
    const price = point < 0 ? 0 : Math.ceil(Number(point) / 50);
    this.inputPointForm.controls['price'].setValue(price);
    return this.inputPointForm.value.price;
  }
}