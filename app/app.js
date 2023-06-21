import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, Button } from 'react-native';
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
    };

    return (
        <View style={{ flex: 1, padding: 10, gap: 10, justifyContent: 'center', alignItems: 'center', fontSize: 32, fontWeight: 'bold' }}>
          
          <Text>
            Faça login!
          </Text>

          <TextInput style={{ width: '75%', borderWidth: 1, borderRadius: 10 }} className='loginInput' placeholder='Usuário'/>
          <TextInput style={{ width: '75%', borderWidth: 1, borderRadius: 10 }} className='loginInput' placeholder='Senha'/>
          
          <View style={{ flex: 0, padding: 10, gap: 10, alignItems: 'center', flexDirection: 'row'}}>
            <Button title='Login'/><Button title='Criar conta'/>
          </View>
          
        </View>
    );
}

export default app;