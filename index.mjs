// const AWS = require('aws-sdk');
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

// const dynamodb = new AWS.DynamoDB.DocumentClient();

const jwtSecret = 'sua-chave-secreta-para-o-JWT';

export const handler = function (event, context, callback) {

    console.log(`event: ${JSON.stringify(event)}`);
    console.log(`context: ${JSON.stringify(context)}`);

    const payload = JSON.parse(event.body);
    const cpf = payload.cpf;

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

        const token = jwt.sign({ userId: cpf }, jwtSecret, { expiresIn: '1h' });

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ token: token }) ,
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
    }
};
