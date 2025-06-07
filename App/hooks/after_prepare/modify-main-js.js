#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const mainJsPath = path.join(__dirname, '../../platforms/electron/www/cdv-electron-main.js');

const preloadJsPath = path.join(__dirname, '../../platforms/electron/www/cdv-electron-preload.js');

fs.readFile(preloadJsPath, 'utf8', (err, data) => {

    let inject = `

    contextBridge.exposeInMainWorld('electronAPI', {
      openExternal: (url) => shell.openExternal(url),
      onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
      onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
      requestUpdateDownload: () => ipcRenderer.send('download-update')
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

/*let morecode = `
  // Comunicar evento "update-available" al renderer para mostrar notificación
  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-available');
  });

  // Opcional: también puedes notificar cuando la actualización esté descargada
  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update-downloaded');
  });
`*/
let morecode = `
//const { spawn } = require('child_process');
app.setAppUserModelId('SchedulerUwu')
const logFile = path.join(app.getPath('userData'), 'app.log');

function logToFile(message) {
  fs.appendFileSync(logFile, \`\${new Date().toISOString()} - \${message}\\n\`);
}

autoUpdater.on('checking-for-update', () => {
  logToFile('🔍 Buscando actualizaciones...');
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update-available', info); // 👈 Enviar al renderer
});

ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate(); // 👈 Descargar si el usuario lo acepta desde el frontend
});

autoUpdater.on('download-progress', (progressObj) => {
  logToFile(\`⬇️ Descargando: \${Math.floor(progressObj.percent)}%\`);
});

autoUpdater.on('update-not-available', () => {
  logToFile('ℹ️ No hay nuevas actualizaciones.');
});

autoUpdater.on('error', (err) => {
  logToFile('❌ Error al buscar actualizaciones: ' + err.message);
});


autoUpdater.on('download-progress', (progressObj) => {
  logToFile('⬇️ Progreso: ' + Math.floor(progressObj.percent) + '%');
});

autoUpdater.on('update-downloaded', (info) => {
  logToFile('📦 Actualización descargada: ' + JSON.stringify(info));
  mainWindow.webContents.send('update-downloaded', info);
  // Probar esto
  const installerPath = info.downloadedFile;

  if (!installerPath || !fs.existsSync(installerPath)) {
    dialog.showErrorBox('Error', 'No se pudo encontrar el instalador descargado.');
    return;
  }

  downloadedInstallerPath = installerPath;
  
});
`;

let inject2 = `
app.on('before-quit', (event) => {
  const logFile = path.join(app.getPath('userData'), 'app.log');
  function logToFile(message) {
  fs.appendFileSync(logFile, \`\${new Date().toISOString()} - \${message}\\n\`);
}
  if (downloadedInstallerPath && fs.existsSync(downloadedInstallerPath)) {
    // Importante: bloquea momentáneamente la salida mientras se lanza el instalador
    event.preventDefault();

    try {
      spawn(downloadedInstallerPath, [], {
        detached: true,
        stdio: 'ignore',
      }).unref();

      downloadedInstallerPath = null;
      app.exit();
    } catch (err) {
      console.error('❌ Error al lanzar el instalador:', err);
      app.exit();
    }
  }
});
`


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

  modified = modified.replace(
    /mainWindow\s*=\s*new\s+BrowserWindow\s*\(\s*browserWindowOpts\s*\);/,
    match => `${match}\n${morecode}`
  );

  modified = modified.replace(
    /const\s+fs\s*=\s*require\(['"]fs['"]\);/,
    "const fs = require('fs');\nconst { autoUpdater } = require('electron-updater');\nconst { dialog } = require('electron');\nconst shell = require('electron')\nconst { spawn } = require('child_process');"
  );

  modified = modified.replace(
    /createWindow\s*\(\s*\);/,
    "createWindow();\nautoUpdater.autoDownload = false;\nautoUpdater.autoInstallOnAppQuit = false;\nautoUpdater.checkForUpdatesAndNotify();"
  );

  modified = modified.replace(
    /app\.on\('ready',\s*\(\)\s*=>\s*{/,
    "const newUserDataPath = path.join(app.getPath('appData'), 'SchedulerUwu');\napp.setPath('userData', newUserDataPath);\napp.on('ready', () => {"
  );

  modified = modified.replace(
    /app\.on\('window-all-closed', \(\) => {/,
    match => `${inject2}\n${match}`
  );

  modified = modified.replace(
    /let\s*mainWindow;/,
    "let mainWindow;\nlet downloadedInstallerPath;"
  );


  fs.writeFile(mainJsPath, modified, 'utf8', (err) => {
    if (err) return console.error('Error al escribir en main.js:', err);
    console.log('✅ Cambios insertados en cdv-electron-main.js');
  });
});
