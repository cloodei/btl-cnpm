import { neon, Pool, PoolClient } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const sql = neon(process.env.DATABASE_URL!);

export default async function typedSql<T = any>(query: string | TemplateStringsArray, ...valuesOrArray: any[]) {
  if(typeof query === 'object') {
    return sql(query, ...valuesOrArray) as Promise<T[]>;
  }
  const values = ((valuesOrArray.length === 1 && Array.isArray(valuesOrArray[0])) ? valuesOrArray[0] : valuesOrArray);
  return sql(query, ...values) as Promise<T[]>;
}

export async function withConnection<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    return await callback(client);
  }
  finally {
    client.release();
  }
}

export async function query<T = any>(query: string, params: any[] = []): Promise<T[]> {
  return withConnection(async (client) => {
    const result = await client.query(query, params);
    return result.rows;
  });
}

export async function multiQuery(queries: string[], params: any[][] = []) {
  return withConnection(async (client) => {
    const result = await Promise.all(queries.map((query, i) => client.query(query, params[i] || [])));
    return result.map(r => r.rows);
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

// CREATE TABLE ratings (
//   id SERIAL PRIMARY KEY,
//   reviewer_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   rating INT,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE (reviewer_id, deck_id)
// );

// CREATE TABLE favorite_decks (
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   viewer_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (deck_id, viewer_id)
// );