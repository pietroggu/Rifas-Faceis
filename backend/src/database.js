const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/database.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Banco conectado!");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS rifas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            premio TEXT NOT NULL,
            imagem TEXT,
            valor_numero REAL NOT NULL,
            quantidade_numeros INTEGER NOT NULL,
            data_sorteio TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL,
            criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run(`
        CREATE TABLE IF NOT EXISTS numeros (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rifa_id INTEGER NOT NULL,
            numero INTEGER NOT NULL,

            vendido INTEGER DEFAULT 0,

            usuario_id INTEGER,

            data_compra DATETIME,

            FOREIGN KEY (rifa_id) REFERENCES rifas(id),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        )
    `);

});

module.exports = db;