import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const BACKUP_FILE = "./users_backup.json";


if (!fs.existsSync(BACKUP_FILE)) {
  fs.writeFileSync(BACKUP_FILE, JSON.stringify([]));
}

function getBackupUsers() {
  try {
    const data = fs.readFileSync(BACKUP_FILE, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function saveBackupUser(user) {
  try {
    const users = getBackupUsers();
    users.push(user);
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("Erro ao salvar backup de usuário:", e);
  }
}

let db = null;
let useFallback = false;

try {
  db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "click_colect",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  
  db.getConnection()
    .then((conn) => {
      console.log("Conectado ao MySQL com sucesso!");
      conn.release();
    })
    .catch((err) => {
      console.error("Erro ao conectar no MySQL:", err.message);
      console.log("ATENÇÃO: Usando banco de dados local fallback em arquivo (users_backup.json) para o MVP.");
      useFallback = true;
    });
} catch (err) {
  console.error("Erro ao configurar conexão MySQL:", err.message);
  console.log("ATENÇÃO: Usando banco de dados local fallback em arquivo (users_backup.json) para o MVP.");
  useFallback = true;
}


app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  if (useFallback) {
    try {
      const users = getBackupUsers();
      const existing = users.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({ error: "Este e-mail já está cadastrado." });
      }

      const newUser = {
        id: users.length + 1,
        name,
        email,
        password
      };

      saveBackupUser(newUser);

      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro no registro fallback:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  try {
    
    const [existing] = await db.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Este e-mail já está cadastrado." });
    }

    
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    );

    const newUser = {
      id: result.insertId,
      name,
      email
    };

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});


app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  if (useFallback) {
    try {
      const users = getBackupUsers();
      const user = users.find((u) => u.email === email && u.password === password);

      if (!user) {
        return res.status(400).json({ error: "E-mail ou senha incorretos." });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Erro no login fallback:", error);
      return res.status(500).json({ error: "Erro interno no servidor." });
    }
  }

  try {
    
    const [users] = await db.execute(
      "SELECT id, name, email FROM users WHERE email = ? AND password = ?",
      [email, password]
    );

    if (users.length === 0) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    return res.status(200).json(users[0]);
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
