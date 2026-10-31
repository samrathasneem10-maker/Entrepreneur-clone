import mysql from 'mysql2/promise';

declare global {
  var _mysqlPool: mysql.Pool | undefined;
}

export function getDbPool(): mysql.Pool {
  if (!globalThis._mysqlPool) {
    globalThis._mysqlPool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_NAME || 'entreprenuer_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return globalThis._mysqlPool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T> {
  const p = getDbPool();
  const [rows] = await p.execute(sql, params);
  return rows as T;
}

export async function testDbConnection(): Promise<{
  connected: boolean;
  message: string;
  database?: string;
  tables?: Array<{ name: string; rows: number }>;
}> {
  try {
    const p = getDbPool();
    const [rows] = await p.query('SELECT 1 as status, DATABASE() as db');
    const dbName = (rows as any[])[0]?.db || 'entreprenuer_db';

    // Fetch all tables in the database and row counts
    const [tableRows] = await p.query(`
      SELECT TABLE_NAME as name, TABLE_ROWS as \`rows\`
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = ?
    `, [dbName]);

    return {
      connected: true,
      message: `Successfully connected to MySQL database: ${dbName}`,
      database: dbName,
      tables: tableRows as Array<{ name: string; rows: number }>,
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || 'Database connection error',
    };
  }
}
