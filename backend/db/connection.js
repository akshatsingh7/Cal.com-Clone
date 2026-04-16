import mysql from 'mysql2/promise';

// Parse DATABASE_URL: mysql://user:password@host:port/database
const parseDatabaseUrl = (url) => {
  const regex = /mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/;
  const match = url.match(regex);
  
  if (!match) {
    throw new Error('Invalid DATABASE_URL format. Expected: mysql://user:password@host:port/database');
  }
  
  return {
    host: match[3],
    port: parseInt(match[4]),
    user: match[1],
    password: match[2],
    database: match[5]
  };
};

// Create connection pool
let pool;

export const initDb = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const config = parseDatabaseUrl(databaseUrl);
  pool = mysql.createPool(config);
  
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    process.exit(1);
  }
};

// Get connection from pool
export const getDb = () => {
  if (!pool) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return pool;
};
