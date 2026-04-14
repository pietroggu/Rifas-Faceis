import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Raffle from "./pages/Raffle";

/**
 * Componente principal com rotas da aplicação
 * Separando rotas públicas e privadas
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Rotas públicas (SEM layout) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Rotas privadas (COM layout) */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/rifa/:id" element={<Raffle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;