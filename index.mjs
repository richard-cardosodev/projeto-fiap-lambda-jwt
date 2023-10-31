// const AWS = require('aws-sdk');
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

// const dynamodb = new AWS.DynamoDB.DocumentClient();

const jwtSecret = 'sua-chave-secreta-para-o-JWT';

export const handler = function (event, context, callback) {
    const userId = event.userId; // Suponha que você recebe o ID do usuário na entrada do evento

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

        const token = jwt.sign({ userId: userId }, jwtSecret, { expiresIn: '1h' });

        callback(null, {
            "statusCode": 200,
            "body": JSON.stringify({ token }),
            "headers": {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        callback(null, {
            "statusCode": 500,
            "body": JSON.stringify({ error, error.message }),
            "headers": {
                "Content-Type": "application/json"
            }
        });
    }
};
