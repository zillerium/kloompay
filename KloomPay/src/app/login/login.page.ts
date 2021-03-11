import { FunctionCall } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import * as bcrypt from 'bcryptjs'; 
import {NavparamService} from '../navparam.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
k:any;
  constructor(public router: Router, private navParamService: NavparamService) { }

  ngOnInit() {
  }

  processFailedLogin() {
  }




  kloomlogin(){
   var userName = (<HTMLInputElement>document.getElementById('email')).value;
   var userPassword = (<HTMLInputElement>document.getElementById('password')).value;
   const passwordHash = bcrypt.hashSync(userPassword, 10);
   const verified = bcrypt.compareSync(userPassword, passwordHash);
   console.log(verified);

  let userInfo={
    'name': userName,
    'passw': userPassword,
    'bcrypt':passwordHash
  } 
  this.navParamService.setNavDAta(userInfo);
  this.router.navigate(['/tabs/tab1']);

  var xhttp = new XMLHttpRequest();
   xhttp.open("POST",  "https://kloompay.com:3000/api/checkUser", true);
   xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
   xhttp.send(JSON.stringify({ "userName": userName, "userPassword": userPassword }));
   xhttp.onreadystatechange = function(){
   if (this.readyState == 4 && this.status == 200) {
       var data = JSON.parse(this.response);
       if (data.response === "ok") {
        if (data.db.result) {
          console.log('correct!');
          window.location.href = "/tabs/tab1"
        } else {
          console.log("wrong password");
        }       
       } else {
        document.getElementById("message").innerHTML="There was an error";
      }
     } 
   };
  }

}
