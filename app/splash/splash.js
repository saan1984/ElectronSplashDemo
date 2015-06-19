var remote = require('remote'),
    BrowserWindow = remote.require('browser-window'),
    Datauri = remote.require('datauri'),
    dUri = Datauri('app/splash/splash.html'),
    splashWindow = new BrowserWindow({
        width: 500,
        height: 300,
        frame:false,
        show:false,
        transparent:true,
        images:true,
        center:true,
        'use-content-size':true,
        'always-on-top':true
    });
splashWindow.loadUrl(dUri);
splashWindow.webContents.on('did-finish-load', function() {
    splashWindow.show();
});
require('ipc').on('splashclose', function(message) {
    splashWindow.close();
});
