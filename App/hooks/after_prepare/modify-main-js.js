#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../../platforms/electron/www/cdv-electron-main.js');

const preloadJsPath = path.join(__dirname, '../../platforms/electron/www/cdv-electron-preload.js');

fs.readFile(preloadJsPath, 'utf8', (err, data) => {

    let inject = `

    contextBridge.exposeInMainWorld('electronAPI', {
      openExternal: (url) => shell.openExternal(url)
    });`


  let modified = data.replace(
  /const \{ contextBridge, ipcRenderer \} = require\('electron'\);/,
  "const { contextBridge, ipcRenderer, shell } = require('electron');"
);

  modified = modified.replace('});', `});${inject}`);

  fs.writeFile(preloadJsPath, modified, 'utf8', (err) => {
    if (err) return console.error('Error al escribir en preload.js:', err);
    console.log('✅ Cambios insertados en cdv-electron-preload.js');
  });
});

fs.readFile(mainJsPath, 'utf8', (err, data) => {
  if (err) return console.error('No se pudo leer main.js:', err);

  if (data.includes('globalShortcut.register')) {
    console.log('El atajo F12 ya está registrado.');
    return;
  }

const injectedCode = `
const { Menu } = require('electron');
const template = [
  {
    label: 'View',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: 'CmdOrCtrl+Shift+I',
        click() {
          mainWindow.webContents.toggleDevTools();
        }
      }
    ]
  }
];
const menu = Menu.buildFromTemplate(template);
mainWindow.setMenu(menu);
mainWindow.setMenuBarVisibility(false);
`;

  // Primero insertamos la línea después de crear la ventana

let modified = data.replace(
  /mainWindow\s*=\s*new\s+BrowserWindow\s*\(\s*browserWindowOpts\s*\);/,
  match => `${match}\n${injectedCode}`
);


  // Luego modificamos el if para añadir && false
 modified = modified.replace(
    /if \(cdvElectronSettings\.browserWindow\.webPreferences\.devTools\)/,
    'if (cdvElectronSettings.browserWindow.webPreferences.devTools && false)'
  );


  fs.writeFile(mainJsPath, modified, 'utf8', (err) => {
    if (err) return console.error('Error al escribir en main.js:', err);
    console.log('✅ Cambios insertados en cdv-electron-main.js');
  });
});
