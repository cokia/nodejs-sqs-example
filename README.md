# nodejs-sqs-example
aws-sqs example with sqs-producer

## Run scripts
  ### Install dependencies
  ```bash
  yarn
  ```
  ### Run producer
  1. Create a .env file in the root directory and add the following variables
  * aws_access_key_id
  * aws_secret_access_key
  * region
  * queue_url

  2. edit producer.ts according to the type of queue you are using. (FIFO / Standard)

  3. Run producer

  ```bash
  yarn producer
  ```
  ### Run consumer
  ```bash
  yarn consumer
  ```

## Example Code Snippet (Producer)
  ### Simple Example for Standard Queue
  ```js
  const exampleProducerFunctionForStandardQueue = async () => {
    const producer = Producer.create({
    queueUrl: config.queueUrl,
    region: config.region
  });

  // send simple messages to the queue
  await producer.send(['msg1', 'msg2']);
  }
  ```

  ### Example for FIFO Queue
  ```js
  const exampleProducerFunctionForFIFOQueue = async () => {
  const producer = Producer.create({
    queueUrl: config.queueUrl,
    region: config.region
  });
  await producer.send({
    id: "testId",
    body: 'Hello world from our FIFO queue!' + new Date().toISOString(),
    groupId: 'group1234',
    // generate md5 hash of body (for deduplication)
    deduplicationId: crypto.createHash('md5').update(body).digest('hex')  
  });
  }
  ```
## Example (Consumer)

  ```js
const app = Consumer.create({
  queueUrl: config.queueUrl,
  region: config.region,
  handleMessage: async (message: { MessageId: string, ReceiptHandle: string, Body: string }) => {
    console.log(`[${timestamp()}] {${message.MessageId}} ${message.Body} is received!`)
    // Super Awesome Messaging handling logic 🚀
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
```