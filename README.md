Hackathon Project

This project implements a stablecoin solution for wallet payments. The reasons for this are - 

1. Unbanked can pay
2. Costs are lower than using fiat wallets (costs are basically zero or 0.02%)
3. Cross border payments are viable and easy to implement

Design 

1. Custody systems are used, eg bitgo. This stores the actual asset.
2. Hot wallets in a private db (postgres) are then used to make internal Kloompay payments.
3. These private wallets when summed up equal in value to the custody value.
4. An exchange could be used for conversions (not implemented).
5. This is all API based.

Implementation

1. Nodejs/PM2/EC2/API service
2. Postgres database
3. Bootstrap html
4. API calls from client to server
5. Custody using bitgo

Future Work 

1. Add mobile app, devops, biometrics, exchange