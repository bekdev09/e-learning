import { app } from "./app";
import dotenv from 'dotenv'
import { initDB } from "./core/db";

dotenv.config()
const PORT: number = Number(process.env.PORT) || 8000;

async function startServer() {
  try {
    await initDB();
    app.listen(PORT, () => {
      console.log(`Server ${PORT} - portda ishga tushdi`);
    });
  } catch (err) {
    console.error('Xato:', err);
  }
}

startServer();