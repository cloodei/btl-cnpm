import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default sql;


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
//   imageUrl VARCHAR,
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
//   commenter_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   comment TEXT NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (commenter_id, deck_id)
// );

// CREATE TABLE favorite_decks (
//   deck_id SERIAL REFERENCES decks(id) ON DELETE CASCADE,
//   viewer_id VARCHAR REFERENCES users(id) ON DELETE CASCADE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   PRIMARY KEY (deck_id, viewer_id)
// );