import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import ShowList from "./components/Pages/ShowList";
import Detail from "./components/Pages/Detail";
import Update from "./components/Pages/Update";
import Create from "./components/Pages/Create";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ShowList />} />
      <Route path="/list" element={<ShowList />} />
      <Route path="/create" element={<Create />} />
      <Route path="/detail/:id" element={<Detail />} />
      <Route path="/update/:id" element={<Update />} />
    </Routes>
  </BrowserRouter>
);
