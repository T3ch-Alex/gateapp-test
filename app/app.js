import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import io from 'socket.io-client';

const host = '192.168.1.3:3000';
const socket = io(`http://${host}`);

const app = () => {
    const [dados, setarDados] = useState(null);

    useEffect(() => {
        buscarDados();

        return () => {
            socket.disconnect();
        };
    }, []);

    const buscarDados = () => {
        socket.emit('httpRequest', {
            metodo: 'GET',
            url: '/', 
        });

        socket.on('httpResponse', (res) => {
            setarDados(res.dados);
        })
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', fontSize: 32, fontWeight: 'bold' }}>
          <Text>{dados ? dados.mensagem : 'Carregando dados...'}</Text>
        </View>
    );
}

export default app;