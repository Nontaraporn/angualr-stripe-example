import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { QrCodePaymentComponent } from './qr-code-payment/qr-code-payment.component';
// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    // QrCodePaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // QRCodeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
