import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Raffle from "./pages/Raffle";
import Boss from "./pages/Boss";
import Dados from "./pages/Dados";
import Ajudas from "./pages/Ajudas";
import Rifas from "./pages/Minhas_rifas";
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
          <Route path="/boss" element={<Boss />} />
          <Route path="/dados" element={<Dados />} />
          <Route path="/ajudas" element={<Ajudas />} />
          <Route path="/suasrifas" element={<Rifas />} />
          <Route path="/rifa/:id" element={<Raffle />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;