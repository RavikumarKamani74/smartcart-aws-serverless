import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const dbClient = new DynamoDBClient({ region: "ap-south-2" });
const snsClient = new SNSClient({ region: "ap-south-2" });

// 🔁 Replace with your SNS topic ARN
const SNS_TOPIC_ARN = "arn:aws:sns:ap-south-2:358238714507:RAV1";

export const handler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : null;

    if (!body || !body.orderId || !body.items || !body.total || !body.userEmail) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "*"
        },
        body: JSON.stringify({ error: "Missing order data" }),
      };
    }

    const { orderId, items, total, userEmail } = body;

    // Step 1: Save order in DynamoDB
    const params = {
      TableName: "SmartCartOrders",
      Item: {
        orderId: { S: orderId },
        items: { S: JSON.stringify(items) },
        total: { N: total.toString() },
        userEmail: { S: userEmail },
        createdAt: { S: new Date().toISOString() }
      }
    };

    await dbClient.send(new PutItemCommand(params));

    // Step 2: Send SNS Order Confirmation
    const snsMessage = `✅ Order Confirmed!\n\nOrder ID: ${orderId}\nTotal: ₹${total}\nThanks for shopping with SmartCart!`;

    await snsClient.send(
      new PublishCommand({
        TopicArn: SNS_TOPIC_ARN,
        Subject: "SmartCart - Order Confirmation",
        Message: snsMessage,
        MessageAttributes: {
          userEmail: {
            DataType: "String",
            StringValue: userEmail
          }
        }
      })
    );

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({ message: "Order stored and confirmation sent!" }),
    };
  } catch (error) {
    console.error("Error storing order:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*"
      },
      body: JSON.stringify({
        error: "Could not save order",
        details: error.message,
      }),
    };
  }
};
