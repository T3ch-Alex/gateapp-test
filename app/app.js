import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import { io } from 'socket.io-client';

const URL = 'http://192.168.1.3:3000';
const socket = io(URL);

const app = () => {
    const [dados, setarDados] = useState(null);

    useEffect(() => {
        buscarDados();

        return () => {
           socket.disconnect();
        };
    }, []);

    const buscarDados = () => {
        socket.on('socketInfo', (info) => {
            console.log('Socket conectado. ID: ' + info);
        });

        console.log('Buscando dados.')
        socket.emit('httpRequest', {
            metodo: 'GET',
            url: '/connect',
        });

        socket.on('httpResponse', (res) => {
            setarDados(res.dados);
            console.log('Dados recebidos!')
        });

        socket.on('httpError', (error) => {
            console.log(error);
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 32, fontWeight: 'bold' }}>
          <Text>{dados ? dados.mensagem : 'Carregando dados...'}</Text>
        </View>
    );
}

export default app;