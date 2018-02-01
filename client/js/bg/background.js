
var mainWindow;

chrome.app.runtime.onLaunched.addListener(function() {
  console.log('runtime launched');  
  if (mainWindow && !mainWindow.contentWindow.closed) {
    console.log('window focused');  
		mainWindow.focus();
	}else{
		chrome.app.window.create('window.html', {id: "mainwindow", innerBounds: {width: 800, height: 600}}, function(w){
        console.log('window created');
        mainWindow = w;
        //client.connect('localhost', 3200);
      });
	}
});
