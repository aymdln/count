const hostname = window.location.hostname 
var socket = io.connect(`http://${hostname}:3002`);
let init = document.querySelector(".init")
let order = document.querySelector(".order")

init.addEventListener('submit', (event) => {
  let value = event.srcElement[0].value;
  let data = { init: true, value: value }
  console.log(data)
  socket.emit('count', data );
})

order.addEventListener('submit', (event) => {
  let value = event.srcElement[0].value;
  let data = { init: false, value: value }
  console.log(data)
  socket.emit('count', data );
})
