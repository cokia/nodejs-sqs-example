import { Consumer } from 'sqs-consumer';
import AWS from 'aws-sdk';
import config from './config'

AWS.config.update({
  region: config.region,
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey
});

function timestamp() {
  var today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().replace('T', ' ').substring(0, 19);
}

const app = Consumer.create({
  queueUrl: config.queueUrl,
  region: config.region,
  handleMessage: async (message: { MessageId: string, ReceiptHandle: string, Body: string }) => {
    console.log(`[${timestamp()}] {${message.MessageId}} ${message.Body} is received!`)
    // Super Awesome Messaging handling logic 🚀
    console.log(`[${timestamp()}] {${message.MessageId}} is destroyed!`)

  },
  sqs: new AWS.SQS()
});

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.on('timeout_error', (err) => {
  console.error(err.message);
});

app.start();