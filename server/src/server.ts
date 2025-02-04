import express, { Request, Response } from "express";
import mysql, { RowDataPacket, ResultSetHeader } from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
  .promise();

interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  age: number;
}

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Succesfully connected to the API!",
    status: 200,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Get all users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<User[]>("SELECT * FROM Users");

    res.status(200).json({
      status: 200,
      data: rows,
      itemsNumber: rows.length,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "DB query failed!" });
  }
});

// Get user by Id
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const [rows] = await pool.query<User[]>(
      "SELECT * FROM Users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      res.status(404).json({
        status: 404,
        message: `No item found with id ${userId}`,
      });
    } else {
      const user = rows[0];
      res.status(200).json({
        status: 200,
        data: user,
      });
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "DB query failed!" });
  }
});

// Post API Endpoint
app.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      throw new Error("One or more missing requirement fields.");
    }

    const connection = await pool.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      "INSERT INTO Users (name, email, age) VALUES (?, ?, ?)",
      [name, email, age]
    );

    connection.release();

    res.status(201).json({
      status: 201,
      message: "Item created!",
      data: {
        ...req.body,
        id: result.insertId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "DB query failed!" });
  }
});

// Update API endpoint
app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, age } = req.body;

    const connection = await pool.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      "UPDATE Users SET name = ?, email = ?, age = ? WHERE id = ?",
      [name, email, age, userId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found!" });
    } else {
      res.status(200).json({
        message: "Item updated successfully!",
        status: 200,
        data: { ...req.body, id: userId },
      });
    }
  } catch (error) {
    res.status(500).json({ error: "DB query failed!" });
  }
});

// Delete API endpoint
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const connection = await pool.getConnection();

    const [result] = await connection.query<ResultSetHeader>(
      "DELETE FROM Users WHERE id = ?",
      [userId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found!" });
    } else {
      res.status(200).json({
        message: "Item deleted  successfully!",
        status: 200,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "DB query failed!" });
  }
});
