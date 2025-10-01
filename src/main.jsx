import React from "react"; // for JSX syntax
import ReactDOM from "react-dom/client"; // mounts React components into the DOM
import './Layout.jsx'
import './App.css'

import App from './App.jsx' // conatins my pages and layout

import { BrowserRouter } from "react-router-dom"; // for page navigation

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
