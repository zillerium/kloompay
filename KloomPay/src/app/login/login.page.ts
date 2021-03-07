import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

 /*  email:string;
  passwoword: string;
 */
  constructor(public router: Router) { }

  ngOnInit() {
  }

  onSubmitLogin(){
    this.router.navigate(['/tabs/tab1']);
    /* this.authService.login(this.email,this.password).then(res =>{
      this.router.navigate(['/tabs/tab1']);
    }).catch(err=> alert('Incorrect Data')); */
  }
 
  processFailedLogin() {
  }

  kloomlogin(){
   var userName = (<HTMLInputElement>document.getElementById('email')).value;
   var userPassword = (<HTMLInputElement>document.getElementById('password')).value;
 
   var xhttp = new XMLHttpRequest();
   xhttp.open("POST",  "https://kloompay.com:3000/api/checkUser", true);
   xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
   xhttp.send(JSON.stringify({ "userName": userName, "userPassword": userPassword }));
   xhttp.onreadystatechange = function(){
   if (this.readyState == 4 && this.status == 200) {
       var data = JSON.parse(this.response);
       if (data.response === "ok") {

        if (data.db.result) {
          window.location.href = "/tabs/tab1"
        } else {
        }       
       } else {
        document.getElementById("message").innerHTML="There was an error";
      }
     } 
   };
  }

    
   



}
