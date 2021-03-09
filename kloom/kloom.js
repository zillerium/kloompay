function kloomlogin() {
    userName = document.getElementById("kloomLogin").value;
    userPassword = document.getElementById("kloomPassword").value;
  
    var xhttp = new XMLHttpRequest();
  
    xhttp.open("POST", "https://kloompay.com:3000/api/checkUser", true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(
      JSON.stringify({ userName: userName, userPassword: userPassword })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        if (data.response === "ok") {
          if (data.db.result) {
            processLogin(userName, data.db.session);
          } else {
            document.getElementById("message").innerHTML = "Password wrong";
          }
        } else {
          document.getElementById("message").innerHTML = "There was an error";
        }
      }
    };
  }
  
  function kloomSignup() {
    userName = document.getElementById("kloomLogin").value;
    userPassword = document.getElementById("kloomPassword").value;
  
    var xhttp = new XMLHttpRequest();
  
    xhttp.open("POST", "https://kloompay.com:3000/api/insertUser", true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(
      JSON.stringify({ userName: userName, userPassword: userPassword })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        if (data.response === "ok") {
          document.getElementById("message").innerHTML =
            "Your user name was registered";
        } else {
          document.getElementById("message").innerHTML = "There was an error";
        }
      }
    };
  }
  
  function currencyLookup(currencies, currency, prop) {
    // Only change code below this line
    for (var i = 0; i < currencies.length; i++) {
      if (currencies[i].currency === currency) {
        if (currencies[i].hasOwnProperty(prop) === true) {
          return currencies[i][prop];
        } else {
          return "No such property";
        }
      }
    }
    return 0;
  }
  
  function kloompay() {
    userName = document.getElementById("kloomLogin").value;
    userPassword = document.getElementById("kloomPassword").value;
    payee = document.getElementById("payee").value;
    amount = document.getElementById("amount").value;
    currency = document.getElementById("currency").value;
    fromcurrency = document.getElementById("fromcurrency").value;
    returnUrl = document.getElementById("returnUrl").value;
    order = document.getElementById("order").value;
  
    // only handle non-exchange at v1
  
    var currencies = [
      {
        currency: "USDC",
        dp: 2,
      },
      {
        currency: "BTC",
        dp: 8,
      },
    ];
  
    if (currency == "USDC") {
      amount = amount * 100;
    }
  
    if (currency == "BTC") {
      amount = amount * 100000000;
    }
  
    var dp = currencyLookup(currencies, currency, "dp");
  
    //No such contact
    console.log(currencyLookup(currency, "dp"));
  
    var xhttp = new XMLHttpRequest();
  
    xhttp.open("POST", "https://kloompay.com:3000/api/makePayment", true);
    xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    xhttp.send(
      JSON.stringify({
        order: order,
        userName: userName,
        userPassword: userPassword,
        payee: payee,
        amount: amount,
        currency: currency,
        dp: dp,
      })
    );
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        if (data.response === "ok") {
          if (data.db.result) {
            paymentMade(returnUrl, order);
          } else {
            document.getElementById("message").innerHTML = "password error";
          }
        } else {
          document.getElementById("message").innerHTML = "There was an error";
        }
      }
    };
  }
  
  function paymentMade(returnUrl, orderDesc) {
    if (returnUrl === "") {
      document.getElementById("message").innerHTML = "payment done";
    } else {
      window.location =
        "http://" + returnUrl + "?order=" + orderDesc + "&paid=true";
    }
  }
  
  function paymentFailed() {
    // show message
  }
  
  function processLogin(userName, session) {
    document.cookie = "session=" + session;
  
    window.location =
      "https://kloompay.com/dashboard.html?username='" + userName + "'";
  }
  
  function processFailedLogin() {}

function getCookie(name) {
  var value = `; ${document.cookie}`;
  var parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function getUrlQueryParam(key) {
  var url = new URL(window.location.href);
  return url.searchParams.get(key);
}


function checkIsLoggedIn (cb) {
  var sessionid = getCookie('session');
  var userName = getUrlQueryParam('userName');

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST",  "https://kloompay.com:3000/api/checkSessionId", true);
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send(JSON.stringify({ "userName": userName, "sessionid": sessionid }));
  xhttp.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response);
      console.log(data);
      if (data.response === "ok" && data.valid === true) {
          cb();
      } else {
          document.getElementById("message").innerHTML="There was an error";
    }
    }
  };
}


function getPayments (cb) {
  var xhttp = new XMLHttpRequest();
  xhttp.open("POST",  "https://kloompay.com:3000/api/getPayments", true);
  xhttp.setRequestHeader("Content-Type", "application/json; charset=utf-8");
  xhttp.send();
  xhttp.onreadystatechange = function(){
  if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.response);
      if (data.response === "ok") {
          cb(data);
      } else {
          document.getElementById("message").innerHTML="There was an error";
    }
    }
  };
}
