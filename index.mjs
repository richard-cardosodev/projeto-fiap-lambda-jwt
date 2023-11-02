// const AWS = require('aws-sdk');
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';
import pg from 'pg';

// const dynamodb = new AWS.DynamoDB.DocumentClient();

const pool = new Pool({
    user: 'ademar',
    host: 'terraform-20231101232846266700000001.cbwfn3u5fvvq.us-east-1.rds.amazonaws.com',
    database: 'fiap_projeto',
    password: 'pagodaodamassa123',
    port: 5432, // Porta padrão do PostgreSQL
});

const jwtSecret = 'sua-chave-secreta-para-o-JWT';

export const handler = async function (event, context, callback) {

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);

    const payload = JSON.parse(event.body);
    const cpf = payload.cpf;

    const client = await pool.connect();

    try {
        // const params = {
        //   TableName: 'NomeDaSuaTabelaNoDynamoDB',
        //   Key: {
        //     userId: userId, // Substitua com a chave primária apropriada
        //   },
        // };

        // const { Item } = await dynamodb.get(params).promise();

        // if (!Item) {
        //   throw new Error('Usuário não encontrado');
        // }

        const result = await client.query('SELECT * FROM clientes c where c.cpf = $1', [cpf]);
        console.log('Resultados da consulta:', result.rows);

        if (result.rows.length === 0) {
            callback(null, {
                statusCode: 404,
                body: 'Nenhum cliente encontrado com o CPF fornecido.',
                headers: {
                    "Content-Type": "application/text"
                }
            });
        }

        const codigoCliente = result.rows[0].codigo;
        const token = jwt.sign({ userId: codigoCliente }, jwtSecret, { expiresIn: '1h' });

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ token: token }),
            headers: {
                "Content-Type": "application/json"
            }
        });
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
