import React, { useState, useEffect } from 'react';
import classes from  './App.module.scss';

const { remote } = window.require('electron');
const mainWindow = remote.getCurrentWindow();
const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

const App = () => {   
	const [status, setStatus] = useState(false)
	const [title, setTitle] = useState('Wrapps Browser')
    const [url, setUrl] = useState('https://google.com')
    const [isLoading, setLoading] = useState(false)
    const [topbar, setTopbar] = useState(false)
    const [webview, setWebview] = useState(document.querySelector('webview'));

    useEffect(() => {
        setWebview(document.querySelector('webview'));		
        ipcRenderer.on('urlOpen', (event, title, url) => {
            if (url.length !== 0) {
                setUrl(url);
                setTitle(title);
            }    
        })
    }, []);

    const handleGoBack = () => {
        webview.goBack();
    };

    const handleGoForward = () => { 
        webview.goForward();
    }

    const handleReload = () => {
        if (isLoading) {
                webview.stop();
                setLoading(false)
        } else {
                webview.reload();
                setLoading(true)
        }
    };

    const handleMinimizeWindow = () => {
        mainWindow.minimize();
    };

    const handleMaximizeWindow = () => {

        if (status) {
            mainWindow.unmaximize();
            setStatus(!status);
        } else { 
            mainWindow.maximize();
            setStatus(!status);
        }		
    };

    const handleCloseWindow = () => {
        mainWindow.close();
    };

    const handleTopbarUp = () => {      
       setTopbar(true)
    };

    const handleTopbarDown = () => {    
       setTopbar(false)
    };

    const top = [classes.webviewContainer, topbar ? classes.up : ''];

    return (
        <div className={classes.layout}>
            <div className={classes.topbarWrap}>
                <div className={classes.topbar} onMouseEnter={handleTopbarUp} onMouseLeave={handleTopbarDown}>
                    
                    <div>
                        <button className={classes.btnWindow} onClick={handleGoBack}><i className="fal fa-chevron-circle-left" /></button> 
                        <button className={classes.btnWindow} onClick={handleGoForward}><i className="fal fa-chevron-circle-right"/></button>
                        <button className={classes.btnWindow} onClick={handleReload}><i className="fal fa-sync"/></button>
                    </div>
                    <div className={classes.title}>{title} - <span>{url}</span></div>
                    <div>
                        <button className={classes.btnWindow} onClick={handleMinimizeWindow}><i className="fal fa-window-minimize" /></button> 
                        <button className={classes.btnWindow} onClick={handleMaximizeWindow}><i className="fal fa-window-maximize" /></button>
                        <button className={classes.btnWindow + " " + classes.closeWindow} onClick={handleCloseWindow}><i className="fal fa-window-close" /></button>
                    </div>
                </div>					
            </div>
        
            <main className={classes.content}>
                <webview src={url}
                className={top.join(' ')}></webview>    
            </main>
        </div>
    );  
}

export default App;
