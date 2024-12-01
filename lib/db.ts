import { neon, Pool, PoolClient } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default sql;

export async function withConnection<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await callback(client);
  }
  finally {
    client.release();
  }
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  return withConnection(async (client) => {
    const result = await client.query(text, params);
    return result.rows;
  });
}

export async function multiQuery(queries: string[], params: any[][] = []) {
  return withConnection(async (client) => {
    const results = [];
    for(let i = 0; i < queries.length; i++) {
      const result = await client.query(queries[i], params[i] || []);
      results.push(result.rows);
    }
    return results;
  });
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  }
  catch(error) {
    await client.query('ROLLBACK');
    throw error;
  }
  finally {
    client.release();
  }
}


// Toàn bộ mô hình database

// CREATE TABLE users (
//   id VARCHAR PRIMARY KEY,
//   username VARCHAR NOT NULL,
//   imageUrl VARCHAR,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE decks (
//   id SERIAL PRIMARY KEY,
//   creator_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   name VARCHAR NOT NULL,
//   public BOOLEAN DEFAULT FALSE,
//   total_rating INT DEFAULT 0,
//   count_ratings INT DEFAULT 0,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE cards (
//   id SERIAL PRIMARY KEY,
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   front VARCHAR NOT NULL,
//   back VARCHAR NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE comments (
//   id SERIAL PRIMARY KEY,
//   commenter_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   comment TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE favorite_decks (
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   viewer_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (deck_id, viewer_id)
// );