import { Injectable } from '@angular/core';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class NavparamService {

  navData:any;
  constructor() { }

  setNavDAta(navObj){
    this.navData=navObj
  }

  getNavData(){
    if (isNullOrUndefined(this.navData))
      return 0
    return this.navData;
  }

}
