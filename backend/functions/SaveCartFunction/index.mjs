import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    // ✅ Parse body correctly for POST
    const body = JSON.parse(event.body || "{}");
    const { userId, items } = body;

    if (!userId || !items) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ message: "Missing userId or items in request body" }),
      };
    }

    const command = new PutCommand({
      TableName: "SmartCartCarts",
      Item: {
        userId,
        items,
        updatedAt: new Date().toISOString(),
      },
    });

    await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Cart saved successfully" }),
    };
  } catch (error) {
    console.error("SaveCartFunction Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
