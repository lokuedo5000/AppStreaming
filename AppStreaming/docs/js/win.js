/*Electron JS*/
const {
  ipcRenderer,
  shell
} = require('electron');
/*Modules All*/
const path = require('path');
const fs = require('fs');

// WebTorrent
var WebTorrent = require('webtorrent');

// Cliente
var client = new WebTorrent();

// parseTorrent
const parseTorrent = require('parse-torrent')

/*Dom*/
window.addEventListener('DOMContentLoaded', () => {

  // // Update App
  // ipcRenderer.on('reset-app', (e, data) => {
  //   // Clear client
  //   client.destroy();
  //
  //   setTimeout(function () {
  //     location.reload();
  //   }, 2000);
  // })

  // Play Peli
  const verpeli = document.querySelector(".run_peli");
  verpeli.addEventListener("click", function(evento) {
    var input = document.querySelector("#magnet");

    // Verificar que el input no este vacio
    if (input.value.length == 0) {
      input.focus();
    }else{

      // Aqui es la funcion donde se agrega un cliente y me envia el video al dom
      // Add Cliente
      client.add(input.value, function(torrent) {
        // Torrents can contain many files. Let's use the .mp4 file
        var file = torrent.files.find(function(file) {
          return file.name.endsWith('.mp4')
        })

        // Add Video
        file.appendTo('.vervideo')
      })

      // Ver Boton Reload
      var btns = document.querySelector(".btnclear");
      btns.classList.remove('d-none');

      // Ocultar Boton Play
      var btns = document.querySelector(".btnplay");
      btns.classList.add('d-none');
    }
  })

  // Play Peli
  const reloadapp = document.querySelector(".clear_peli");
  reloadapp.addEventListener("click", function(evento) {

    // Reload
    ipcRenderer.send('win-reload', 'reload');

    // // input
    // var inputMagnet = document.querySelector("#magnet");
    //
    // // Parse Torrent
    // var parseGetMagnet = parseTorrent(inputMagnet.value);
    //
    // // Delete Torremt
    // const t = client.get(parseGetMagnet.infoHash);
    // if (t) {
    //   t.destroy();
    // }
    //
    // // Clear client
    // client.destroy();
    //
    // setTimeout(function () {
    //   location.reload();
    // }, 2000);
  })


  /* Action Win Minimize & Maximize => (Working) & Close*/
  let actionWin = document.querySelectorAll('.actionwin');
  actionWin.forEach(link => {
    link.addEventListener('click', () => {
      ipcRenderer.send('win-action', link.getAttribute('data-action'));
    })
  })
  /*Respuestas*/
  ipcRenderer.on('win-action-max', (e, data) => {
    if (data == 'min') {
      var maximiz = document.querySelector('.maximiz');
      maximiz.classList.remove('cwI-cheveron-up');
      maximiz.classList.add('cwI-cheveron-down');
    }else if (data == 'max') {
      var maximiz = document.querySelector('.maximiz');
      maximiz.classList.remove('cwI-cheveron-down');
      maximiz.classList.add('cwI-cheveron-up');
    }
  })

})
