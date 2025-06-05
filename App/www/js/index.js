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

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');

    // Obtener la versión de la app
    if (window.cordova && cordova.getAppVersion) {
        cordova.getAppVersion.getVersionNumber(function(version) {
            console.log('Versión de la app:', version);
            document.querySelector(".version").textContent = "Version: " + version;
            Toastify({
                text: "Hay una nueva versión de la app disponible",
                duration: 5000,
                avatar: "https://cdn-icons-png.flaticon.com/512/3502/3502477.png",
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                className: "toastify-custom",
                style: {
                    borderRadius: "10px",
                    color: "black",
                    background: "white",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                },
                onClick: function(){
                    openExternalLink("https://img.freepik.com/vector-premium/lindo-personaje-poop-kawaii-contorno-negro-vector-ilustracion-aislada-estilo-doodle_485992-757.jpg")
                } // Callback after click
                }).showToast();
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