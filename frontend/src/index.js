import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'  //The official React-Redux package provides bindings between React and Redux.
import store from './store'
import './bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // Pass in that store file
  <Provider store={store}>         
  {/* Putting a <Provider> component around your root component makes the store accessible to all connected components. */}
  {/* Any component in your application can be wrapped with 'connect' function and "connected" to the store. */}
  {/* The connect function generates wrapper "container" components that subscribe to the store. */}
  {/* So you don't have to write store subscription code for every component that needs to talk to the store. */}
    <App />     
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
