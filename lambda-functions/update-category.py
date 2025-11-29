import json
import boto3
from datetime import datetime
from decimal import Decimal

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

# TODO: Replace with your actual table name
CANDIDATES_TABLE_NAME = 'your-candidates-table-name'  # e.g., 'idd-candidates'
table = dynamodb.Table(CANDIDATES_TABLE_NAME)

def lambda_handler(event, context):
    """
    Lambda function to update candidate category
    
    Expected payload:
    {
        "registrationId": "REG123",
        "category": "Singing",
        "assignedCategorizer": "CAT001"
    }
    """
    
    try:
        # Parse request body
        if isinstance(event.get('body'), str):
            body = json.loads(event['body'])
        else:
            body = event
        
        # Extract parameters
        registration_id = body.get('registrationId')
        category = body.get('category')
        assigned_categorizer = body.get('assignedCategorizer')
        
        # Validate required fields
        if not registration_id:
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
                    'message': 'registrationId is required'
                })
            }
        
        if not category:
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
                    'message': 'category is required'
                })
            }
        
        # Prepare update expression
        update_expression = "SET category = :category, categorizedAt = :categorizedAt"
        expression_values = {
            ':category': category,
            ':categorizedAt': datetime.utcnow().isoformat()
        }
        
        # Add categorizer info if provided
        if assigned_categorizer:
            update_expression += ", assignedCategorizer = :assignedCategorizer"
            expression_values[':assignedCategorizer'] = assigned_categorizer
        
        # Update the item in DynamoDB
        # Assuming pk is the partition key - adjust based on your table structure
        response = table.update_item(
            Key={
                'pk': registration_id,  # Adjust if your key structure is different
                # 'sk': 'CANDIDATE'  # Add if you use sort key
            },
            UpdateExpression=update_expression,
            ExpressionAttributeValues=expression_values,
            ReturnValues='ALL_NEW'
        )
        
        print(f"Successfully updated category for {registration_id}: {category}")
        
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
                'message': f'Category updated successfully to {category}',
                'data': {
                    'registrationId': registration_id,
                    'category': category,
                    'assignedCategorizer': assigned_categorizer
                }
            }, default=str)
        }
        
    except Exception as e:
        print(f"Error updating category: {str(e)}")
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
                'message': f'Error updating category: {str(e)}'
            })
        }
