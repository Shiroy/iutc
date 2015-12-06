/// <reference path="typings/tsd.d.ts" />

import express = require("express");
import morgan = require("morgan");
import socketio = require("socket.io");
import serveStatic = require("serve-static");
import cookieParser = require("cookie-parser");
var cookie = require("cookie");

var session = require('express-session');

var CASAuthentication = require('cas-authentication');

let app = express();

app.use( session({
    secret            : 'super secret key',
    resave            : false,
    saveUninitialized : true
}));

app.disable('etag');

var cas = new CASAuthentication({
    cas_url     : 'https://cas.utc.fr/cas',
    service_url : 'http://localhost:3000',
    cas_version: '2.0',
    session_name    : 'cas_user',
    session_info: 'cas_info'

});
app.get('/', cas.bounce, function(req, res, next){
    res.cookie("nom", req.session['cas_info']['sn']);
    res.cookie("prenom", req.session['cas_info']['givenname']);
    res.cookie("login", req.session['cas_user']);
    next();
});
app.use(morgan("combined"));
app.use(cookieParser("azerty"));
app.use("/", serveStatic(__dirname + '/public'));

let http = app.listen(3000, function(){
    console.log("Server listening on port 3000");
});

let io = socketio(http);

io.on("connection", function(socket){

    socket.client.request.cookie = cookie.parse(socket.client.request.headers.cookie);

    var nom = socket.client.request.cookie.nom;
    var prenom = socket.client.request.cookie.prenom;

    socket.on("disconnect", function(){
        console.log("One client disconnect");
    });

    socket.on("chat-msg", function(msg){
        console.dir(msg);

        io.emit("chat-msg", {author: prenom + ' ' + nom, text: msg, date: Date.now()});
    });
});
