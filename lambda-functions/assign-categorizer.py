import json
import boto3
from datetime import datetime

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

# TODO: Replace with your actual table names
CANDIDATES_TABLE_NAME = 'your-candidates-table-name'  # Main candidates table
CATEGORIZER_ASSIGNMENTS_TABLE = 'categorizer-assignments'  # New table for categorizer assignments

candidates_table = dynamodb.Table(CANDIDATES_TABLE_NAME)
assignments_table = dynamodb.Table(CATEGORIZER_ASSIGNMENTS_TABLE)

def lambda_handler(event, context):
    """
    Lambda function to assign candidates to categorizers
    
    Expected payload:
    {
        "registrationIds": ["REG123", "REG124", "REG125"],
        "categorizerId": "CAT001",
        "categorizerName": "categorizer1"
    }
    """
    
    try:
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        # Extract parameters
        registration_ids = body.get('registrationIds', [])
        categorizer_id = body.get('categorizerId')
        categorizer_name = body.get('categorizerName')
        
        # Validate required fields
        if not registration_ids or not isinstance(registration_ids, list):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'registrationIds array is required'
                })
            }
        
        if not categorizer_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                'body': json.dumps({
                    'success': False,
                    'message': 'categorizerId is required'
                })
            }
        
        updated = []
        failed = []
        
        # Process each registration ID
        for reg_id in registration_ids:
            try:
                # Create assignment record in categorizer assignments table
                assignment_item = {
                    'pk': reg_id,
                    'sk': f'CATEGORIZER#{categorizer_id}',
                    'categorizerId': categorizer_id,
                    'categorizerName': categorizer_name or categorizer_id,
                    'assignedAt': datetime.utcnow().isoformat(),
                    'status': 'pending'  # pending, categorized
                }
                
                assignments_table.put_item(Item=assignment_item)
                
                # Also update the main candidates table with categorizer assignment
                candidates_table.update_item(
                    Key={
                        'pk': reg_id,
                        # 'sk': 'CANDIDATE'  # Add if you use sort key
                    },
                    UpdateExpression='SET assignedCategorizer = :categorizer, categorizerAssignedAt = :assignedAt',
                    ExpressionAttributeValues={
                        ':categorizer': categorizer_id,
                        ':assignedAt': datetime.utcnow().isoformat()
                    }
                )
                
                updated.append(reg_id)
                print(f"Successfully assigned {reg_id} to {categorizer_id}")
                
            except Exception as e:
                print(f"Failed to assign {reg_id}: {str(e)}")
                failed.append({
                    'registrationId': reg_id,
                    'error': str(e)
                })
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'success': True,
                'message': f'Assigned {len(updated)} candidates to {categorizer_name or categorizer_id}',
                'updated': updated,
                'failed': failed,
                'summary': {
                    'total': len(registration_ids),
                    'successful': len(updated),
                    'failed': len(failed)
                }
            })
        }
        
    except Exception as e:
        print(f"Error in assign categorizer: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            'body': json.dumps({
                'success': False,
                'message': f'Error assigning categorizers: {str(e)}'
            })
        }
