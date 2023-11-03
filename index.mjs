// const AWS = require('aws-sdk');
import jwt from 'jsonwebtoken';
import pkg from 'pg';

const { Pool } = pkg;
// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'test_db',
//     password: 'postgres-projeto-fiap-2023-Q1-64',
//     port: 5432,
//     max: 1,
//     idleTimeoutMillis: 30000,
//     connectionTimeoutMillis: 2000
// });
const pool = new Pool({
    user: 'fiap_user',
    host: 'projeto-fiap-db.c8jiyjlno5mw.us-east-1.rds.amazonaws.com',
    database: 'fiap_projeto',
    password: 'fiap_course1234',
    port: 5432,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: {
        rejectUnauthorized: false
    }
});

const jwtSecret = 'sua-chave-secreta-para-o-JWT';

export const handler = async function (event, context, callback) {

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);

    const payload = JSON.parse(event.body);
    const cpf = payload.cpf;

    const client = await pool.connect();

    try {
        const result = await client.query('SELECT * FROM clientes WHERE cpf = $1::text', [cpf]);
        console.log('Resultados da consulta:', result.rows);

        if (result.rows.length === 0) {
            callback(null, {
                statusCode: 404,
                body: JSON.stringify({ message: 'Nenhum cliente encontrado com o CPF fornecido.' }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } else {
            const codigoCliente = result.rows[0].codigo;
            const token = jwt.sign({ userId: codigoCliente }, jwtSecret, { expiresIn: '1h' });

            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ token: token }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }
    } catch (error) {
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    } finally {
        client.release(); // Libera a conexão de volta para o pool
    }
};
