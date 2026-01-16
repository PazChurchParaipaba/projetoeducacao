// api/neon.js
// Esse arquivo fica escondido no servidor, o usuário não vê.
import { neon } from '@neondatabase/serverless';

// Pegue essa URL no painel do Neon
const sql = neon(process.env.DATABASE_URL);

export default sql;