import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import StateContextProvider from "./context/stateContext";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StateContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StateContextProvider>
  </React.StrictMode>
);
