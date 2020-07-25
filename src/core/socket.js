import io from 'socket.io-client'
import store from '@/store';

const socket = io('http://localhost:4040');

socket.on('connect', () => {
  console.log('%c%s', 'color: green; font-size: 23px', "REAL_SOCKET_CONNECT")
  //console.log(localStorage.token)
  let realToken = localStorage.token;
  realToken && socket.emit('JOIN', {token: realToken});
  socket.on('FORB', () => {
    console.log('%c%s', 'color: pink; font-size: 18px;', 'FORBIDDEN');
    delete localStorage.token
  })
})


export default socket
