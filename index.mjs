import jwt from 'jsonwebtoken';
import pkg from 'pg';

const BD_USER = process.env.BD_USER;
const BD_PASSWORD = process.env.BD_PASSWORD;
const BD_HOST = process.env.BD_HOST;
const BD_PORT = process.env.BD_PORT;
const BD_DATABASE = process.env.BD_DATABASE;

const QUERY_BUSCA_CLIENT_ID = 'SELECT * FROM clientes WHERE cpf = $1::text';

const { Pool } = pkg;
const pool = new Pool({
    user: BD_USER,
    password: BD_PASSWORD,
    host: BD_HOST,
    port: BD_PORT,
    database: BD_DATABASE,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false
    }
});

const JWT_SECRET = process.env.JWT_SECRET;

export const handler = async function (event, context, callback) {
    const payload = JSON.parse(event.body);
    const cpf = payload.cpf;
    // const client = await pool.connect();

    try {
        const result = await client.query(QUERY_BUSCA_CLIENT_ID, [cpf]);
        console.log('Resultados da consulta:', result.rows);

        if (result.rows.length === 0) {
            callback(null, makeResponse(404, {message: 'Nenhum cliente encontrado com o CPF fornecido.'}) );
        } else {
            const payload = {codigo: result.rows[0].codigo, nome: result.rows[0].nome, email: result.rows[0].email};
            const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
            callback(null, makeResponse(200, {token: token}));
        }
    } catch (error) {
        callback(null, makeResponse(500, {error: error.message}));
    } finally {
        // client.release();
        await pool.end();
    }
};

function makeResponse(code, body, header = null) {
    return {
        statusCode: code,
        body: JSON.stringify(body),
        headers: header ? header : {"Content-Type": "application/json"}
    }
}
