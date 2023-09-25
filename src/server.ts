import { db_host, db_name, port } from "./config";
const express = require('express');
const mongoose = require('mongoose');
import Logger from './core/Logger';
import app from './app';

// const url = `mongodb://localhost/event`;
const url = `mongodb://${db_host}/${db_name}`;

// DB connection
mongoose.connect(url, {useNewUrlParser:true})
const con  = mongoose.connection

con.on('open', () => {
    console.log("Database connected");
});

// API Routing

app.listen(port, () => {
    console.log(`server running on port : ${port}`);
  }).on('error', (err) => console.log("error :", err));