import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Raffle from "./pages/Raffle";

/**
 * Componente principal com rotas da aplicação
 */
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/rifa/:id" element={<Raffle />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;