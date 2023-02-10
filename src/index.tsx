import { FocusStyleManager } from "@blueprintjs/core";
import React from "react";
import ReactDOM from "react-dom";
import AppWithRouterAccess from "./AppWithRouterAccess";
import "./index_compiled.css";
import reportWebVitals from "./reportWebVitals";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <AppWithRouterAccess />
    </DndProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
