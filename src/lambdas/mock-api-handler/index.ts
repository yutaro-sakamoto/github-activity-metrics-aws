import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import ipRangeCheck from "ip-range-check";
import { GITHUB_ACTIONS_IP_RANGE } from "./ips";

/**
 * Lambda handler that always returns a successful response with fixed data
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // Check source IP address
  const sourceIp =
    event.requestContext?.identity?.sourceIp ||
    event.requestContext?.http?.sourceIp;

  console.log(`Request from source IP: ${sourceIp}`);

  // Validate IP is from GitHub
  if (sourceIp) {
    if (!ipRangeCheck(sourceIp, GITHUB_ACTIONS_IP_RANGE)) {
      console.error(`Request from invalid IP: ${sourceIp}`);
      return {
        statusCode: 403,
        body: JSON.stringify({
          message: "Forbidden",
          error: "Invalid IP address",
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }
  }

  console.log("Event received:", JSON.stringify(event, null, 2));

  // Fixed response data
  const responseData = {
    status: "success",
    message: "API call successful",
    timestamp: new Date().toISOString(),
    data: {
      items: [
        { id: 1, name: "Item 1", value: 100 },
        { id: 2, name: "Item 2", value: 200 },
        { id: 3, name: "Item 3", value: 300 },
      ],
      metadata: {
        totalCount: 3,
        apiVersion: "1.0.0",
      },
    },
  };

  // Return fixed successful response
  return {
    statusCode: 200,
    body: JSON.stringify(responseData),
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };
};
