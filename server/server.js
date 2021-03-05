// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');

const app = express();
//const { Pool, Client } = require('pg')
const pg = require('pg');
const asyncHandler = require('express-async-handler');

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const result = require('dotenv').config()
const accessToken = process.env.ACCESS_TOKEN;
console.log(accessToken)
const BitGo = require('bitgo');
const bitgo = new BitGo.BitGo({ accessToken: accessToken }); // defaults to testnet. add env: 'prod' if you want to go against mainnet

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'kloom',
  password: 'password',
  port: 5432,
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM test1', (error, results) => {
    if (error) {
	    console.log('error');
	    console.log(error);
      throw error
    }
	  console.log('success');
	  console.log(JSON.stringify(results));
//    response.status(200).json(results.rows)
  })
}

getUsers();

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
	console.log(hash);
    });
});
 

request = require('request');
const bodyParser = require('body-parser');
var wget = require('node-wget');
var url = require('url');
var path = require('path');

const privateKey = fs.readFileSync('privkey.pem', 'utf8');
const certificate = fs.readFileSync('fullchain.pem', 'utf8');
//const ca = fs.readFileSync('csr.pem', 'utf8');


const credentials= {
    key: privateKey,
    cert: certificate
}
 

app.get("/api/ping", function(req, res) {
    res.json({ message: "pong" });
});

app.use('/', express.static(path.join(__dirname, '/html')));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
 
app.post("/api/getWalletDetails",  asyncHandler(async (req, res, next) => {
    var walletId = req.body.walletId;
	console.dir("before call");
    var result = await getwallet(walletId);
	console.dir("after call");
	console.dir(result);
    res.json({response:"ok", "message": "Correct", "doc": result})
})); 


app.post("/api/getWalletList",  asyncHandler(async (req, res, next) => {
    console.log("wallet list called");
	var wallets = await getWalletList();
    res.json({response:"ok", "message": "Correct", "doc": wallets.list})
}));

app.post("/api/checkUser",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var password = req.body.password;
    var jsonHash = await checkUserDB(userName);
    console.log('===============password checked  ' + jsonHash[0].password_hash);
    var str = JSON.stringify(jsonHash);
    console.log(str);
    var hash=jsonHash[0].password_hash;

    bcrypt.compare(password, hash, async function(err, result) {
        console.log(result);
    });

    res.json({response:"ok", "message": "Correct" })
}));

app.post("/api/checkAccount",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var sql =  "select user_name, balance, currency from account where user_name = '" + userName +"' ";
console.log(sql)
    var jsonHash = await checkDB( sql);
    console.log('===============account checked  ' + jsonHash[0]);
    var str = JSON.stringify(jsonHash);
    console.log(str);
    var o ={};
    o[0]=[];
    var data= {
        userName: jsonHash[0].user_name,
        balance: jsonHash[0].balance,
        currency: jsonHash[0].currency,
        dp: jsonHash[0].dp
    }

    res.json({response:"ok", "db": data })
}));

app.post("/api/insertAccount",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var balance = req.body.balance;
    var dp = req.body.dp;
    var currency = req.body.currency;

    var sql = "insert into account (user_name, balance, dp, currency) values "+
    "('" + userName +"'," + balance  + "," + dp +",'" + currency + "')";	
   
    console.log(sql);
     await insertDB(  sql);
  

    res.json({response:"ok", "db": "account inserted" })
}));

app.post("/api/insertDeposit",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var amount = req.body.amount;
    var dp = req.body.dp;
    var currency = req.body.currency;
    var fromWallet = req.body.from_wallet;

    var sql = "insert into deposit (user_name, amount, dp, currency, from_wallet, deposit_date) values "+
    "('" + userName +"'," + amount  + "," + dp +",'" + currency + "','" + fromWallet + "', NOW() )";	
   
    console.log(sql);
     await insertDB(  sql);
  

    res.json({response:"ok", "db": "deposit inserted" })
}));


app.post("/api/checkDeposit",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var sql =  "select user_name, amount, dp, currency, from_wallet, deposit_date from deposit where user_name = '" + userName +"' ";

    var jsonHash = await checkDB(sql);
    console.log('===============deposit checked  ' + jsonHash[0]);
    var str = JSON.stringify(jsonHash);
    console.log(str);
    var o ={};
    o[0]=[];
    var data= {
        user_name: jsonHash[0].user_name,
        amount: jsonHash[0].amount,
        currency: jsonHash[0].currency,
        dp: jsonHash[0].dp,
        from_wallet: jsonHash[0].from_wallet,
        deposit_date: jsonHash[0].deposit_date
    }

    res.json({response:"ok", "db": data })
}));



app.post("/api/insertExchange",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var fromAmount = req.body.fromAmount;
    var fromDp = req.body.fromDp;
    var fromCurrency = req.body.fromCurrency;
    var toAmount = req.body.toAmount;
    var toDp = req.body.toDp;
    var toCurrency = req.body.toCurrency;

    var sql = "insert into exchange (user_name, from_amount, from_dp, from_currency, to_amount, to_dp, to_currency, exchange_date) values "+
    "('" + userName +"'," + fromAmount  + "," + fromDp +",'" + fromCurrency + "'," + toAmount  + "," + toDp +",'" + toCurrency   + "', NOW() )";	
   
    console.log(sql);
     await insertDB(  sql);
  

    res.json({response:"ok", "db": "exchange inserted" })
}));

app.post("/api/checkExchange",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var sql =  "select    user_name, from_amount, from_dp, from_currency, to_amount, to_dp, to_currency,"+
     "exchange_date from exchange where user_name = '" + userName +"' ";

  console.log(sql)

    var jsonHash = await checkDB(sql);
    console.log('===============exchange checked  ' + jsonHash[0]);
    var str = JSON.stringify(jsonHash);

    console.log(str);
    var o ={};
    o[0]=[];
    var data= {
        user_name: jsonHash[0].user_name,
        from_amount: jsonHash[0].from_amount,
        from_currency: jsonHash[0].from_currency,
        from_dp: jsonHash[0].from_dp,
        to_amount: jsonHash[0].to_amount,
        to_currency: jsonHash[0].to_currency,
        to_dp: jsonHash[0].to_dp,
        exchange_date: jsonHash[0].exchange_date
    }

    res.json({response:"ok", "db": data })
    
}));

app.post("/api/insertPayment",  asyncHandler(async (req, res, next) => {
    var payer = req.body.payer;
    var payee = req.body.payee;
    var amount = req.body.amount;
    var dp = req.body.dp;
    var currency = req.body.currency;
    var paymentDesc = req.body.paymentDesc;

    var sql = "insert into payment (payer, payee, amount, dp, currency, payment_desc, date_time) values "+
    "('" + payer +"','" + payee  + "'," + amount + "," + dp +",'" + currency + "','" +  paymentDesc + "', NOW() " +")";	
   
    console.log(sql);
     await insertDB( sql);
  

    res.json({response:"ok", "db": "payment inserted" })
}));


app.post("/api/checkPayment",  asyncHandler(async (req, res, next) => {
    var payer = req.body.payer;
    var sql =  "select payer, payee, amount, dp, currency, payment_desc, date_time from payment where payer = '" + payer +"' ";

    var jsonHash = await checkDB(sql);
    console.log('===============payment checked  ' + jsonHash[0]);
    var str = JSON.stringify(jsonHash);
    console.log(str);
    var o ={};
    o[0]=[];
    var data= {
        payer: jsonHash[0].payer,
        payee: jsonHash[0].payee,
        amount: jsonHash[0].amount,
        currency: jsonHash[0].currency,
        dp: jsonHash[0].dp,
        payment_desc: jsonHash[0].payment_desc,
        date_time: jsonHash[0].date_time
    }

    res.json({response:"ok", "db": data })
}));


app.post("/api/insertUser",  asyncHandler(async (req, res, next) => {
    var userName = req.body.userName;
    var password = req.body.password;

    bcrypt.genSalt(saltRounds, async function(err, salt) {
        bcrypt.hash(password, salt, async function(err, hash) {
            // Store hash in your password DB.
            console.log(hash);
            var res = await insertUserDB(userName, hash);
        });
    });
	
    res.json({response:"ok", "message": "inserted" })
}));

async function insertUserDB(userName, passwordHash) {

    var sql = "insert into user_credential (user_name, password_hash) values ('" + userName +"','" + passwordHash + "')";	
    console.log(sql);
    await pool.query(
      sql,
      async function(err, res)  {
          console.log(err, res);
	  pool.end;
      }
    );	    
    return 0;

}

async function insertDB(sql) {
    console.log('check user db');
  //  var sql = "select user_name from account where user_name = '" + userName +"' ";
    var res;
    try { 
    res = await pool.query(sql);
    pool.end;
	return res.rows;
    } catch (err) {
        console.log(err);
    }
} 

async function checkDB( sql) {
    console.log('check user db');
  //  var sql = "select user_name from account where user_name = '" + userName +"' ";
    var res;
    try { 
    res = await pool.query(sql);
    pool.end;
	return res.rows;
    } catch (err) {
        console.log(err);
    }
}

async function checkUserDB(userName) {
    console.log('check user db');
    var sql = "select password_hash from user_credential where user_name = '" + userName +"' ";
    var res;
    try { 
    res = await pool.query(sql);
    pool.end;
	return res.rows;
    } catch (err) {
        console.log(err);
    }
}

async function getwallet(wallet) {
	 var result1;
   await  bitgo.getWalletAddress({ address: wallet }, function(err, result) {
      if (err) { console.log(err); process.exit(-1); }
	console.dir("res in fn");
	   console.dir(result);
	   console.log("before return");
	  // return 10;
	  result1=result;
	   console.log("after return");
    })
	return result1;
}

async function getWalletList() {
	console.log("data - get wallet list");
    var wallets = await bitgo.wallets();
    wallets.list({}, function callback(err, data) {
    // handle error, do something with wallets
    for (var id in data.wallets) {
      var wallet = data.wallets[id].wallet;
      console.log(JSON.stringify(wallet, null, 4));
    }
    });
	console.log("data - end wallet list");
	return wallets;
}



 
// Starting both http & https servers
const httpsServer = https.createServer(credentials, app);

//const httpsServer = https.createServer(credentials, app);
//const httpServer = http.createServer(app);


httpsServer.listen(3000, () => {
    console.log('HTTPS Server running on port 3000');
});
