/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
import { constants } from './constants.js';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    checkUpdates();

    // Obtener la versión de la app
    if (window.cordova && cordova.getAppVersion) {
        cordova.getAppVersion.getVersionNumber(function(version) {
            console.log('Versión de la app:', version);
            document.querySelector(".version").textContent = "Version: " + version + " api: " + constants.apiURL;
        });
    } else {
        console.log('El plugin cordova-plugin-app-version no está disponible.');
    }
}


function openExternalLink(url) {
  if (window.cordova) {
    if (cordova.platformId === 'electron') {
      try {
        window.electronAPI.openExternal(url);
      } catch (e) {
        console.warn("Fallo en Electron shell:", e);
        // fallback o aviso
      }
    } else {
      cordova.InAppBrowser.open(url, '_system');
    }
  } else {
    window.open(url, '_blank'); // navegador puro
  }
}

function checkUpdates() {
  if (window.electronAPI) {
    window.electronAPI.onUpdateAvailable(() => {
      let toast = Toastify({
        text: "¡Hay una nueva versión de la app disponible!",
        duration: 7000,
        gravity: "top",
        avatar: "https://cdn-icons-png.flaticon.com/512/3502/3502477.png",
        position: "center",
        stopOnFocus: true,
        close: true,
        className: "toastify-custom",
        style: {
            borderRadius: "10px",
            color: "black",
            background: "white",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        },
        onClick: function() {
          window.electronAPI.requestUpdateDownload();
          toast.hideToast();
        }
      }).showToast();
    });

    window.electronAPI.onUpdateDownloaded(() => {
      Toastify({
        text: "Actualización descargada. Reinicia para aplicar cambios.",
        duration: 7000,
        gravity: "top",
        position: "center",
        close: true,
        style: {
          background: "#4CAF50",
          color: "#fff",
          borderRadius: "8px"
        },
        onClick: function() {
          // Puedes enviar un mensaje para que el main reinicie e instale
          // o avisar al usuario que cierre la app manualmente.
        }
      }).showToast();
    });
  }
}