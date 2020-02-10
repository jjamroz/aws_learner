/**
 * Route: POST /set
 */

const uuidv4 = require('uuid/v4');
const responseHandler = require('../../utils/responseHandler');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;

exports.handler = async event => {
  let item = JSON.parse(event.body);
  item.set_id = uuidv4();
  item.user_id = event.headers.app_user_id;

  let params = {
    TableName: tableName,
    Item: item
  };

  try {
    await dynamodb.put(params).promise();
    return responseHandler.success(item);
  } catch (err) {
    return responseHandler.error(err);
  }
};
