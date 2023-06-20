//Libraries
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const path = require('path'); //Used for finding complex folders paths
const bcrypt = require('bcrypt');

//const mongodb = require('mongodb');
//const connectionString = 'mongodb://0.0.0.0:27017/gateapp-test';
//const db = mongodb(connectionString);
//const accounts = db.collection('accounts');

const host = '192.168.1.3';
const port = 3000;

var SOCKET_LIST = {};

io.on('connection', (socket) => {
    socket.id = Math.floor(Math.random() * 90000) + 10000;
    SOCKET_LIST[socket.id] = socket;
    console.log('client connected! socket: ' + socket.id);
    io.emit('socketInfo', socket.id);

    socket.on('httpRequest', (request) => {
        const { metodo, url } = request;

        if(metodo === 'GET' && url === '/connect') {
            const dados = {
                mensagem: 'Olá seja bem vindo, conectado ao servidor!😄',
            };
            io.emit('httpResponse', { dados });
        }        
    });

    socket.on('createAcc', (data) => {
        var existingUser; 
        const saltRounds = 10;
        
        accounts.find( { email: data.email }, (err, result) => {
            if(err) {
                console.log('Internal server Error, user not found. Error: ', err);
                let msg = "Internal server Error, user not found. Error: " + err;
                io.emit('errMsg', msg);
                return
            }
            existingUser = result[0]; 

            if(existingUser) {
                let msg = "Account already exists with this email";
                io.emit('errMsg', msg);
                return
            }

            //Gerar o salt, depois gerar o hash com o salt
            bcrypt.genSalt(saltRounds, (err, salt) => {
                if(err) {
                    let msg = "Internal server error";
                    io.emit('errMsg', msg);
                    return
                }
                bcrypt.hash(data.password, salt, (err, hashedPassword) => {
                    if(err) {
                        let msg = "Internal server error";
                        io.emit('errMsg', msg);
                        return
                    }

                    //Se gerado, criar novo usuario
                    const newAccount = { 
                        email: data.email, 
                        password: hashedPassword,
                        role: 1
                    };

                    accounts.insertOne(newAccount);

                    let msg = "User registered succesfully!";
                    io.emit('errMsg', msg);
                    return
                });
            });
        });
    });

    socket.on('logIn', (data) => {
        var userFound;
        accounts.find( { email: data.email }, (err, result) => {
            if(err || !result || result.length > 1) {
                let msg = "Internal server error";
                io.emit('errMsg', msg);
                return
            }
            if(result.length > 0) {
                userFound = result[0];
            }    
            if(!userFound) {
                console.log('User not found.');
                let msg = "User with this email not found.";
                io.emit('errMsg', msg);
                return
            }
            //Comparar password com o hash na database
            bcrypt.compare(data.password, userFound.password, (err, result) => {
                if(err || !result) {
                    let msg = "Authentication failed! at password";
                    io.emit('errMsg', msg);
                    return
                }
                Player.onConnect(socket);
                let msg = "Congrats, youve logged in " + userFound.email + "!!";
                io.emit('loginIn', msg);
            });        
        });
    });
    
    socket.on('clientMessage', (msg) => {
        var clientMsg = socket.id + ': ' + msg;
        io.emit('clientMessage', clientMsg);
    });

    socket.on('disconnect', () => {
        delete SOCKET_LIST[socket.id];
        console.log('Cliente desconectado');
    });
});

server.listen(port, host, () => {
    console.log(`Server listening at ${host} on port ${port}`);
});