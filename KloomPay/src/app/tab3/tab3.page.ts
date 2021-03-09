import { Component } from '@angular/core';
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx'
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
/*   value = 'https://kloompay.com/';
  scannedCode = null;
  title = 'app';
  elementType = 'url'; */
  title = 'app';
  elementType = 'url';
  value = 'Techiediaries';
  
  constructor(private scanner: BarcodeScanner, private gallerry: Base64ToGallery, private toastC: ToastController ) {}




}
