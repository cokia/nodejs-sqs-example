require('dotenv').config({ path: `${__dirname}/../.env` });

export default {
  queueUrl: process.env.queueUrl || 'https://sqs.ap-northeast-2.amazonaws.com/account-id/queue-name',
  region: process.env.region || 'ap-northeast-2',
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key
}