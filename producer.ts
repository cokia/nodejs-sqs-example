import { Producer } from 'sqs-producer';
import config from './config'
import crypto from 'crypto'

function timestamp() {
  var today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString().replace('T', ' ').substring(0, 19);
}

const exampleProducerFunctionForStandardQueue = async () => {
  // create custom producer (supporting all opts as per the API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property)
  const producer = Producer.create({
    queueUrl: config.queueUrl,
    region: config.region
  });

  // send simple messages to the queue
  await producer.send(['msg1', 'msg2']);

  // send a message to the queue with a specific ID (by default the body is used as the ID)
  await producer.send([{
    id: 'id1',
    body: 'Hello Standard Queue!' + timestamp()
  }]);

  // send a message to the queue with
  // - delaySeconds (must be an number contained within 0 and 900)
  // - messageAttributes
  await producer.send([
    {
      id: 'id1',
      body: 'Hello world with two string attributes: attr1 and attr2',
      messageAttributes: {
        attr1: { DataType: 'String', StringValue: 'stringValue' },
        attr2: { DataType: 'Binary', BinaryValue: new Buffer('binaryValue') }
      }
    },
    {
      id: 'id2',
      body: 'Hello world delayed by 5 seconds',
      delaySeconds: 5
    }
  ]);
  console.log(`[${timestamp()}] successfully sent message to FIFO queue!`)

  // get the current size of the queue
  const size = await producer.queueSize();
  console.log(`There are ${size} messages on the queue.`);
}

const exampleProducerFunctionForFIFOQueue = async () => {
  // create custom producer (supporting all opts as per the API docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#constructor-property)
  const producer = Producer.create({
    queueUrl: config.queueUrl,
    region: config.region
  });

  // send a message to a FIFO queue
  //
  // note that AWS FIFO queues require two additional params:
  // - groupId (string)
  // - deduplicationId (string)
  //
  // deduplicationId can be excluded if content-based deduplication is enabled
  //
  // http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queue-recommendations.html
  const body = 'Hello FIFO queue! ' + timestamp()
  await producer.send({
    id: "testId",
    body,
    groupId: 'group1234',
    // generate md5 hash of body
    deduplicationId: crypto.createHash('md5').update(body).digest('hex')
  });

  console.log(`[${timestamp()}] successfully sent message to FIFO queue!`)

  const size = await producer.queueSize();
  console.log(`There are ${size} messages on the queue.`);
}

exampleProducerFunctionForFIFOQueue()
// exampleProducerFunctionForStandardQueue()
