// AWS Lambda Function - Update Category (Node.js)
// Matches your existing eventregistrations table structure
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Initialize DynamoDB client
const REGION = "ap-south-1";
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Your existing table name
const TABLE_NAME = 'eventregistrations';

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

exports.handler = async (event) => {
    try {
        // Handle OPTIONS for CORS preflight
        if (event.requestContext?.http?.method === 'OPTIONS' || event.httpMethod === 'OPTIONS') {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: ''
            };
        }

        // Parse request body
        const body = typeof event.body === 'string' ? JSON.parse(event.body) : event;
        const { registrationId, category, assignedCategorizer, pk, sk } = body;

        // Validate required fields
        if (!registrationId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: 'registrationId is required'
                })
            };
        }

        let pkValue = pk;
        let skValue = sk;

        // If pk/sk not provided, fallback to Scan (but correctly this time!)
        if (!pkValue || !skValue) {
            console.log(`⚠️ Missing pk/sk for ${registrationId}, performing scan...`);
            const scanCommand = new ScanCommand({
                TableName: TABLE_NAME,
                FilterExpression: 'registrationId = :regId',
                ExpressionAttributeValues: {
                    ':regId': { S: registrationId }
                }
                // REMOVED Limit: 1 because it breaks the scan!
            });

            const scanResult = await client.send(scanCommand);

            if (!scanResult.Items || scanResult.Items.length === 0) {
                return {
                    statusCode: 404,
                    headers: corsHeaders,
                    body: JSON.stringify({
                        success: false,
                        message: `Candidate with registrationId ${registrationId} not found`
                    })
                };
            }

            const item = scanResult.Items[0];
            pkValue = item.pk?.S;
            skValue = item.sk?.S;
        }

        if (!pkValue || !skValue) {
            return {
                statusCode: 500,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: `Missing pk/sk for registrationId ${registrationId}`
                })
            };
        }

        // Prepare update expression
        let updateExpression = 'SET category = :category, categorizedAt = :categorizedAt';
        const expressionValues = {
            ':category': category,
            ':categorizedAt': new Date().toISOString()
        };

        // Add categorizer info if provided
        if (assignedCategorizer) {
            updateExpression += ', assignedCategorizer = :assignedCategorizer';
            expressionValues[':assignedCategorizer'] = assignedCategorizer;
        }

        // Update the item in DynamoDB using pk and sk
        const updateCommand = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                pk: pkValue,
                sk: skValue
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionValues,
            ReturnValues: 'ALL_NEW'
        });

        const response = await docClient.send(updateCommand);

        console.log(`✅ Successfully updated category for ${registrationId}: ${category}`);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: `Category updated successfully to ${category}`,
                data: {
                    registrationId,
                    category,
                    assignedCategorizer,
                    pk: pkValue,
                    sk: skValue
                }
            })
        };

    } catch (error) {
        console.error('❌ Error updating category:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Error updating category: ${error.message}`
            })
        };
    }
};
