/**
 * Route: POST /set
 */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const uuidv4 = require('uuid/v4');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.SETS_TABLE;

exports.handler = async event => {
  console.log(event);

  let { set_id, body } = event;

  try {
    let item = JSON.parse(body);
    item.set_id = uuidv4();

    let params = {
      TableName: tableName,
      Item: item
    };

    let data = await dynamodb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(item)
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
