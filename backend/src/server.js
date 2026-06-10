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
            valor_numero,
            quantidade_numeros,
            data_sorteio
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            nome,
            descricao,
            premio,
            imagem,
            valor_numero,
            quantidade_numeros,
            data_sorteio
        ],
        function(err) {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            const rifaId = this.lastID;

            // Gera os números da rifa na tabela numeros
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

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});
