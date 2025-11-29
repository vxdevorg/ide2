const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "ap-south-1" });

exports.handler = async (event) => {
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    try {
        const command = new ScanCommand({
            TableName: "eventregistrations"
        });

        const data = await client.send(command);

        // Transform data to simple JSON and INCLUDE pk/sk
        const items = (data.Items || []).map(item => {
            const plainItem = {};
            for (const key in item) {
                // Handle DynamoDB types (S, N, BOOL, etc.)
                const value = item[key];
                if (value.S !== undefined) plainItem[key] = value.S;
                else if (value.N !== undefined) plainItem[key] = value.N;
                else if (value.BOOL !== undefined) plainItem[key] = value.BOOL;
                else if (value.NULL !== undefined) plainItem[key] = null;
                else plainItem[key] = value;
            }
            // Explicitly ensure pk and sk are included if they exist
            if (item.pk && item.pk.S) plainItem.pk = item.pk.S;
            if (item.sk && item.sk.S) plainItem.sk = item.sk.S;

            return plainItem;
        });

        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(items)
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: error.message })
        };
    }
};
