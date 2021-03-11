import { Component } from '@angular/core';
import {NavparamService} from '../navparam.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  value = 'https://kloompay.com/';
  scannedCode = null;
  title = 'app';
  elementType = 'url'; 
  info:any;
  constructor(private navParamService: NavparamService) {
/*     this.info=this.navParamService.getNavData()
    console.log(this.info);
    let x=this.info.bcrypt;
    console.log(x); */
  }
  ngOnInit() {
    this.info=this.navParamService.getNavData()
  }


}
