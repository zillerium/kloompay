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
    console.log('===============password checked  ' + jsonHash);
    var str = JSON.stringify(jsonHash);
    console.log(str);
    var hash='1';
	bcrypt.compare(password, hash, async function(err, result) {
        console.log(result);
    });

    res.json({response:"ok", "message": "Correct" })
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
	
    res.json({response:"ok", "message": "Correct" })
}));

async function insertUserDB(username, passwordhash) {

    var sql = "insert into users (username, passwordhash) values ('" + username +"','" + passwordhash + "')";	
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

async function checkUserDB(username) {
    console.log('check user db');
    var sql = "select passwordhash from users where username = '" + username +"' ";
    var res;
    try { 
	res = await pool.query(sql);
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
