/**
 * Route: GET /set/{set_id}
 */

const uuidv4 = require('uuid/v4');
const responseHandler = require('../../utils/responseHandler');
const _ = require('underscore');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;

exports.handler = async event => {
  const set_id = event.pathParameters.set_id;
  const user_id = event.headers.app_user_id;
  const params = {
    TableName: tableName,
    Key: {
      set_id: set_id,
      user_id: user_id
    }
  };

  try {
    const data = await dynamodb.get(params).promise();
    const set = data.Item;

    return _.isEmpty(set)
      ? responseHandler.notFound()
      : responseHandler.success(set);
  } catch (err) {
    return responseHandler.error(err);
  }
};
