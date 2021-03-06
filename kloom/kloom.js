function kloomlogin() {
    userName  = document.getElementById("kloomLogin").value;
    userPassword  = document.getElementById("kloomPassword").value;
    
    var xhttp = new XMLHttpRequest();
	
    xhttp.open("POST",  "https://kloompay.com:3000/api/checkUser", true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(JSON.stringify({ "userName": userName, "userPassword": userPassword }));
    xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        if (data.response === "ok") {
            if (data.db.result) {
                processLogin(userName, data.db.session);
	        } else {
                processFailedLogin();
            }
        
        } else {
              document.getElementById("message").innerHTML="There was an error";
	    }
      }
    };
}

function processLogin(userName, session) {
document.cookie = "session="+session;
 
window.location = "https://kloompay.com/dashboard.html"

}

function processFailedLogin() {


}
