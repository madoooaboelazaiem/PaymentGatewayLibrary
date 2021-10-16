# Paypal Payment Gateway Library

This repo contains the Payment Gateway Library built with node, express and mongodb

## Getting Started

folder structure is inspired by https://softwareontheroad.com/ideal-nodejs-project-structure/ with some modifications like adding controllers and dbm folder

### Prerequisites

in order to install this repo you need to make sure you have git, node installed on your machine along with nodemon and the dependencies

### Installing

A step by step series of examples that tell you how to get a development env running

clone this repo

open terminal and change directory to the project root

install project dependencies

```
npm install
```

create .env in project root directory and copy its data from env.example

```
cp env.example .env
```

fill out the .env file with the name for database you chose and also change the other env variable according the description provided in `env.example`

run the project

```
npm run start-dev
```

## Swagger Docs

I used the swagger.js npm library to have it within the application instead of using a separate url to access the swagger documentation
run the app and go to: http://localhost:3000/api-docs/

## Payment Procedures:

1. Add your name, price, currency and credit card information (Note: only valid card with valid expiry date would result in a successfull payment)
2. Check the payment transaction on https://www.sandbox.paypal.com/mep/dashboard using the following email and password:
   **Email**: https://www.sandbox.paypal.com/mep/dashboard
   **Password**: 12345678

## To run tests:

`npm run test`

## Built With

- [Express](https://expressjs.com/) - The web framework used
- [Mongodb](https://www.mongodb.com/) - Cloud Database
- [npm](https://www.npmjs.com/) - Dependency Management
- [Swagger](https://swagger.io/docs/) - Swagger Documentation For RESTful API

## Authors

- **Mohamed Salama**
