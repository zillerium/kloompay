import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
import {NgxQRCodeModule} from '@techiediaries/ngx-qrcode';
import {NavparamService} from './navparam.service';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, NgxQRCodeModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  BarcodeScanner,
  Base64ToGallery,
  NavparamService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
   