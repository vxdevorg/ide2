// AWS Lambda Function - Get Assigned Candidates (Node.js)
// Matches your existing eventregistrations table structure
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

// Initialize DynamoDB client
const REGION = "ap-south-1";
const client = new DynamoDBClient({ region: REGION });
const docClient = DynamoDBDocumentClient.from(client);

// Your existing table name
const TABLE_NAME = 'eventregistrations';
// New table for categorizer assignments
const CATEGORIZER_ASSIGNMENTS_TABLE = 'categorizer-assignments';

const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
};

// Helper function to convert DynamoDB item to plain object
function unmarshallItem(item) {
    const result = {};
    for (const [key, value] of Object.entries(item)) {
        if (value.S) result[key] = value.S;
        else if (value.N) result[key] = value.N;
        else if (value.BOOL !== undefined) result[key] = value.BOOL;
        else if (value.NULL) result[key] = null;
        else result[key] = value;
    }
    return result;
}

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

        // Get categorizer ID from query parameters
        const categorizerId = event.queryStringParameters?.categorizerId;

        if (!categorizerId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: 'categorizerId query parameter is required'
                })
            };
        }

        // 1. Get all assigned registration IDs for this categorizer
        const scanAssignmentsCommand = new ScanCommand({
            TableName: CATEGORIZER_ASSIGNMENTS_TABLE,
            FilterExpression: 'categorizerId = :categorizer',
            ExpressionAttributeValues: {
                ':categorizer': { S: categorizerId }
            }
        });

        const assignmentsResponse = await client.send(scanAssignmentsCommand);
        const assignmentItems = assignmentsResponse.Items || [];
        const assignedRegistrationIds = new Set(assignmentItems.map(item => item.pk?.S).filter(Boolean));

        if (assignedRegistrationIds.size === 0) {
            return {
                statusCode: 200,
                headers: corsHeaders,
                body: JSON.stringify([])
            };
        }

        console.log(`✅ Found ${assignedRegistrationIds.size} assignments for ${categorizerId}`);

        // 2. Scan the MAIN table once (Optimized: O(1) Scan vs O(N) Scans)
        // Since we don't have the PK/SK of the main table, we must scan it.
        // Scanning once is faster than scanning N times for N candidates.
        const scanMainTableCommand = new ScanCommand({
            TableName: TABLE_NAME
        });

        const mainTableResponse = await client.send(scanMainTableCommand);
        const allCandidates = mainTableResponse.Items || [];

        // 3. Filter in memory
        const matchedCandidates = [];
        for (const item of allCandidates) {
            const candidate = unmarshallItem(item);
            if (candidate.registrationId && assignedRegistrationIds.has(candidate.registrationId)) {
                matchedCandidates.push(candidate);
            }
        }

        console.log(`✅ Matched ${matchedCandidates.length} candidates from main table`);

        const responseHeaders = {
            ...corsHeaders,
            'X-Debug-Assignments-Found': assignedRegistrationIds.size.toString(),
            'X-Debug-Candidates-Fetched': matchedCandidates.length.toString()
        };

        return {
            statusCode: 200,
            headers: responseHeaders,
            body: JSON.stringify(matchedCandidates)
        };

    } catch (error) {
        console.error('❌ Error getting assigned candidates:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Error fetching candidates: ${error.message}`
            })
        };
    }
};
