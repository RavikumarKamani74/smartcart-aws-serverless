import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  };

  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Missing userId in query parameters" }),
      };
    }

    const command = new GetCommand({
      TableName: "SmartCartCarts",
      Key: { userId }, // ← keep using userId since your table uses this key
    });

    const result = await docClient.send(command);

    if (!result.Item) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Cart not found", cart: { items: [] } }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Cart retrieved", cart: result.Item }),
    };
  } catch (error) {
    console.error("GetCartFunction Error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
