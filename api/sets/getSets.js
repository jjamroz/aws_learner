/**
 * Route: GET /sets
 */

const uuidv4 = require('uuid/v4');
const responseHandler = require('../../utils/responseHandler');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;
const indexName = 'user_id-index';

exports.handler = async event => {
  const user_id = event.headers.app_user_id;
  const query = {
    TableName: tableName,
    IndexName: indexName,
    KeyConditionExpression: 'user_id = :id',
    ExpressionAttributeValues: {
      ':id': user_id
    }
  };

  try {
    const data = await dynamodb.query(query).promise();
    return responseHandler.success(data.Items);
  } catch (err) {
    return responseHandler.error(err);
  }
};
