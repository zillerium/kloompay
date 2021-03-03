import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email:string;
  passwoword: string;

  constructor(public router: Router) { }

  ngOnInit() {
  }

  onSubmitLogin(){
    this.router.navigate(['/tabs/tab1']);
    /* this.authService.login(this.email,this.password).then(res =>{
      this.router.navigate(['/tabs/tab1']);
    }).catch(err=> alert('Incorrect Data')); */
  }


}
