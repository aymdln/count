const obj = document.querySelectorAll(".obj")
const hostname = window.location.hostname 
var socket = io.connect(`http://${hostname}:3002`);

const odometer = new Odometer({
  el: obj[0],
  format: '( ddd),dd',
  theme: 'plaza'
})

socket.on('data', function (data) {
  if (data.init === true) {
    odometer.update(parseInt(data.value))
  } else {
    let value = odometer.value - parseInt(data.value)
    odometer.update(value)
  }
});

window.addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    odometer.update(150000)
  }, 800);
});
