import json
import boto3

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

# TODO: Replace with your actual table names
CANDIDATES_TABLE_NAME = 'your-candidates-table-name'
CATEGORIZER_ASSIGNMENTS_TABLE = 'categorizer-assignments'

candidates_table = dynamodb.Table(CANDIDATES_TABLE_NAME)
assignments_table = dynamodb.Table(CATEGORIZER_ASSIGNMENTS_TABLE)

def lambda_handler(event, context):
    """
    Lambda function to get candidates assigned to a specific categorizer
    
    Query parameters:
    - categorizerId: The categorizer ID (e.g., CAT001)
    
    Example: GET /get-assigned-candidates?categorizerId=CAT001
    """
    
    try:
        # Get categorizer ID from query parameters
        categorizer_id = event.get('queryStringParameters', {}).get('categorizerId')
        
        if not categorizer_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'categorizerId query parameter is required'
                })
            }
        
        # Query assignments table for this categorizer
        # This assumes GSI on categorizerId or you scan with filter
        response = assignments_table.scan(
            FilterExpression='categorizerId = :categorizer',
            ExpressionAttributeValues={
                ':categorizer': categorizer_id
            }
        )
        
        assignment_items = response.get('Items', [])
        registration_ids = [item['pk'] for item in assignment_items]
        
        # Fetch full candidate details from main table
        candidates = []
        for reg_id in registration_ids:
            try:
                candidate_response = candidates_table.get_item(
                    Key={
                        'pk': reg_id,
                        # 'sk': 'CANDIDATE'  # Add if you use sort key
                    }
                )
                
                if 'Item' in candidate_response:
                    candidates.append(candidate_response['Item'])
                    
            except Exception as e:
                print(f"Error fetching candidate {reg_id}: {str(e)}")
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            'body': json.dumps(candidates, default=str)
        }
        
    except Exception as e:
        print(f"Error getting assigned candidates: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            'body': json.dumps({
                'success': False,
                'message': f'Error fetching candidates: {str(e)}'
            })
        }
