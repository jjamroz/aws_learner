/**
 * Route: PATCH /sets
 */
const responseHandler = require('../../utils/responseHandler');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;

exports.handler = async event => {
  const item = JSON.parse(event.body);
  item.user_id = event.headers.app_user_id;

  const params = {
    TableName: tableName,
    Item: item,
    ConditionExpression: 'user_id = :id',
    ExpressionAttributeValues: {
      ':id': item.user_id
    }
  };

  try {
    await dynamodb.put(params).promise();

    return responseHandler.success(item);
  } catch (err) {
    return responseHandler.error(err);
  }
};
