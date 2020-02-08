/**
 * Route: GET /sets/{user_id}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const uuidv4 = require('uuid/v4');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;
const indexName = 'access-user_id-index';

exports.handler = async event => {
  console.log(event);

  let user_id = event.pathParameters;

  let expression = 'access = :acc';
  let values = { ':acc': 'public' };

  if (user_id) {
    expression = expression + ' AND user_id = :id';
    values = { ':acc': 'private', ':id': user_id };
  }

  let query = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: expression,
    ExpressionAttributeValues: values
  };

  console.log(query);

  try {
    let data = await dynamodb.query(query).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log('Error', err);
    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      body: JSON.stringify({
        error: err.name ? err.name : 'Exception',
        message: err.message ? err.message : 'Unknown error'
      })
    };
  }
};
