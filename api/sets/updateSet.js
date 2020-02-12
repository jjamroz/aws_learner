/**
 * Route: PATCH /set
 */
const responseHandler = require('../../utils/responseHandler');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;

exports.handler = async event => {
  let item = JSON.parse(event.body);
  let user_id = event.headers.app_user_id;

  let params = {
    TableName: tableName,
    Item: item,
    ConditionExpression: 'user_id = :id',
    ExpressionAttributeValues: {
      ':id': user_id
    }
  };

  try {
    await dynamodb.put(params).promise();

    return responseHandler.success(data);
  } catch (err) {
    return responseHandler.error(err);
  }
};
