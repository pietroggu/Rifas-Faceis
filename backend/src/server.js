const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend funcionando!");
});

app.post("/rifas", (req, res) => {

    const {
        nome,
        descricao,
        premio,
        imagem,
        categoria,
        instituicao,
        valor_numero,
        quantidade_numeros,
        data_sorteio
    } = req.body;

    const sql = `
        INSERT INTO rifas (
            nome,
            descricao,
            premio,
            imagem,
            categoria,
            instituicao,
            valor_numero,
            quantidade_numeros,
            data_sorteio
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            nome,
            descricao,
            premio,
            imagem,
            categoria,
            instituicao,
            valor_numero,
            quantidade_numeros,
            data_sorteio
        ],
        function(err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            const rifaId = this.lastID;

            const insertNumero = db.prepare(
                "INSERT INTO numeros (rifa_id, numero) VALUES (?, ?)"
            );

            db.serialize(() => {
                for (let i = 1; i <= quantidade_numeros; i++) {
                    insertNumero.run([rifaId, i]);
                }

                insertNumero.finalize((errFinalize) => {
                    if (errFinalize) {
                        return res.status(500).json({ erro: errFinalize.message });
                    }

                    res.status(201).json({
                        mensagem: "Rifa criada com sucesso!",
                        id: rifaId
                    });
                });
            });
        }
    );
});

app.get("/rifas", (req, res) => {
    db.all("SELECT * FROM rifas", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        res.json(rows);
    });
});

app.get("/rifas/:id", (req, res) => {
    const { id } = req.params;

    db.get(
        "SELECT * FROM rifas WHERE id = ?",
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            res.json(row);
        }
    );
});

app.get("/rifas/:id/numeros", (req, res) => {
    const { id } = req.params;

    db.all(
        `
        SELECT *
        FROM numeros
        WHERE rifa_id = ?
        ORDER BY numero
        `,
        [id],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            res.json(rows);
        }
    );
});

/**
 * POST /rifas/:id/numeros/:numero/comprar
 * Registra a compra de um número da rifa.
 * Cria o usuário caso ainda não exista (baseado no telefone).
 * Retorna 409 se o número já estiver vendido.
 */
app.post("/rifas/:id/numeros/:numero/comprar", (req, res) => {
    const { id, numero } = req.params;
    const { nome, telefone } = req.body;

    if (!nome || !telefone) {
        return res.status(400).json({ erro: "Nome e telefone são obrigatórios." });
    }

    // Busca usuário existente pelo telefone
    db.get("SELECT id FROM usuarios WHERE telefone = ?", [telefone], (err, usuario) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }

        function marcarVendido(usuarioId) {
            db.run(
                `UPDATE numeros
                 SET vendido = 1, usuario_id = ?, data_compra = CURRENT_TIMESTAMP
                 WHERE rifa_id = ? AND numero = ? AND vendido = 0`,
                [usuarioId, id, numero],
                function(err2) {
                    if (err2) {
                        return res.status(500).json({ erro: err2.message });
                    }

                    if (this.changes === 0) {
                        return res.status(409).json({ erro: "Número já vendido ou não encontrado." });
                    }

                    res.json({ mensagem: "Compra realizada com sucesso!" });
                }
            );
        }

        if (usuario) {
            // Usuário já existe, só marca o número
            marcarVendido(usuario.id);
        } else {
            // Cria novo usuário e depois marca o número
            db.run(
                "INSERT INTO usuarios (nome, telefone) VALUES (?, ?)",
                [nome, telefone],
                function(err2) {
                    if (err2) {
                        return res.status(500).json({ erro: err2.message });
                    }

                    marcarVendido(this.lastID);
                }
            );
        }
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
