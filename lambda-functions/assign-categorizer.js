// AWS Lambda Function - Assign Categorizer (Node.js)
// Matches your existing eventregistrations table structure
const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, QueryCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

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

        // Support both old (registrationIds) and new (candidates) formats for backward compatibility
        let candidatesToProcess = [];
        let totalCount = 0;

        if (body.candidates && Array.isArray(body.candidates)) {
            candidatesToProcess = body.candidates;
            totalCount = candidatesToProcess.length;
        } else if (body.registrationIds && Array.isArray(body.registrationIds)) {
            console.warn('Received old format registrationIds, this might be slow');
            candidatesToProcess = body.registrationIds.map(id => ({ registrationId: id }));
            totalCount = candidatesToProcess.length;
        }

        const { categorizerId, categorizerName } = body;

        if (totalCount === 0) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: 'candidates array or registrationIds array is required'
                })
            };
        }

        if (!categorizerId) {
            return {
                statusCode: 400,
                headers: corsHeaders,
                body: JSON.stringify({
                    success: false,
                    message: 'categorizerId is required'
                })
            };
        }

        const updated = [];
        const failed = [];

        // Process candidates in parallel to avoid timeout
        const processCandidate = async (candidate) => {
            const regId = candidate.registrationId;
            let pkValue = candidate.pk;
            let skValue = candidate.sk;

            try {
                const assignedAt = new Date().toISOString();

                // If pk/sk missing (old format fallback), we MUST scan to find them
                if (!pkValue || !skValue) {
                    // console.log(`⚠️ Missing pk/sk for ${regId}, performing fallback scan...`);
                    const scanCommand = new ScanCommand({
                        TableName: TABLE_NAME,
                        FilterExpression: 'registrationId = :regId',
                        ExpressionAttributeValues: { ':regId': { S: regId } },
                        Limit: 1
                    });
                    const scanResult = await client.send(scanCommand);
                    if (!scanResult.Items || scanResult.Items.length === 0) {
                        throw new Error('Candidate not found via scan');
                    }
                    pkValue = scanResult.Items[0].pk?.S;
                    skValue = scanResult.Items[0].sk?.S;
                }

                if (!pkValue || !skValue) {
                    throw new Error('Missing pk/sk keys');
                }

                // 1. Delete existing assignments (Query + Delete)
                const queryCommand = new QueryCommand({
                    TableName: CATEGORIZER_ASSIGNMENTS_TABLE,
                    KeyConditionExpression: 'pk = :pk',
                    ExpressionAttributeValues: { ':pk': regId }
                });

                const existingAssignments = await docClient.send(queryCommand);

                const deletePromises = [];
                if (existingAssignments.Items && existingAssignments.Items.length > 0) {
                    for (const oldAssignment of existingAssignments.Items) {
                        deletePromises.push(docClient.send(new DeleteCommand({
                            TableName: CATEGORIZER_ASSIGNMENTS_TABLE,
                            Key: { pk: oldAssignment.pk, sk: oldAssignment.sk }
                        })));
                    }
                    await Promise.all(deletePromises);
                }

                // 2. Create new assignment record & 3. Update main table (Parallel)
                await Promise.all([
                    docClient.send(new PutCommand({
                        TableName: CATEGORIZER_ASSIGNMENTS_TABLE,
                        Item: {
                            pk: regId,
                            sk: `CATEGORIZER#${categorizerId}`,
                            categorizerId: categorizerId,
                            categorizerName: categorizerName || categorizerId,
                            assignedAt: assignedAt,
                            status: 'pending'
                        }
                    })),
                    docClient.send(new UpdateCommand({
                        TableName: TABLE_NAME,
                        Key: { pk: pkValue, sk: skValue },
                        UpdateExpression: 'SET assignedCategorizer = :categorizer, categorizerAssignedAt = :assignedAt',
                        ExpressionAttributeValues: {
                            ':categorizer': categorizerId,
                            ':assignedAt': assignedAt
                        }
                    }))
                ]);

                return { success: true, regId };

            } catch (error) {
                console.error(`❌ Failed to assign ${regId}:`, error);
                return { success: false, regId, error: error.message };
            }
        };

        // Execute all assignments in parallel
        const results = await Promise.all(candidatesToProcess.map(candidate => processCandidate(candidate)));

        // Process results
        results.forEach(result => {
            if (result.success) {
                updated.push(result.regId);
            } else {
                failed.push({ registrationId: result.regId, error: result.error });
            }
        });

        console.log(`✅ Bulk assignment complete. Success: ${updated.length}, Failed: ${failed.length}`);

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({
                success: true,
                message: `Assigned ${updated.length} candidates to ${categorizerName || categorizerId}`,
                updated: updated,
                failed: failed,
                summary: {
                    total: totalCount,
                    successful: updated.length,
                    failed: failed.length
                }
            })
        };

    } catch (error) {
        console.error('❌ Error in assign categorizer:', error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({
                success: false,
                message: `Error assigning categorizers: ${error.message}`
            })
        };
    }
};
