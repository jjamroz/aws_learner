/**
 * Route: GET /set/{set_id}
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const uuidv4 = require('uuid/v4');
const responseHandler = require('../../utils/responseHandler');
const _ = require('underscore');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;

exports.handler = async event => {
  let set_id = event.pathParameters.set_id;
  let user_id = event.headers.app_user_id;
  let params = {
    TableName: tableName,
    Key: {
      set_id: set_id,
      user_id: user_id
    }
  };

  try {
    let data = await dynamodb.get(params).promise();

    return _.isEmpty(data)
      ? responseHandler.notFound()
      : responseHandler.success(data);
  } catch (err) {
    return responseHandler.error(err);
  }
};
