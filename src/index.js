import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './polyfills';
/* import BrowserRouter from 'react-router-dom' */
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import './i18n';
import {setup, initLoginRequired} from './utils/GawatiAuthClient';

//import './index.css';
import 'bootstrap/dist/css/bootstrap-reboot.css';
import 'bootstrap/dist/css/bootstrap.css';
import './css/bootstrap-overrides.css';
import './css/app-custom.css';
import './css/app-media.css';

setup().then(() => {
    initLoginRequired(
        () => {
            ReactDOM.render(
                <BrowserRouter>
                    <App />
                </BrowserRouter>,
                document.getElementById('root')
            );
        },
        (error) => {
            console.log("ERROR initLoginRequired ", "Error while logging in" );
            alert("There was an error while initializing login");
        }
    );
}).catch((e) => {
    console.log(e);
    alert("There was an error while setting up authentication");
});

registerServiceWorker();
