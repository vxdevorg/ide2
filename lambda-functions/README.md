# AWS Lambda Functions for Categorization Portal

This directory contains Lambda functions for the categorization portal system.

## Functions

### 1. update-category.py
Updates the category for a candidate in the main candidates table.

**Endpoint Type:** POST  
**Payload:**
```json
{
  "registrationId": "REG123",
  "category": "Singing",
  "assignedCategorizer": "CAT001"
}
```

**DynamoDB Updates:**
- Adds/updates `category` field in candidates table
- Adds/updates `assignedCategorizer` field
- Adds `categorizedAt` timestamp

---

### 2. assign-categorizer.py
Assigns candidates to categorizers for categorization work.

**Endpoint Type:** POST  
**Payload:**
```json
{
  "registrationIds": ["REG123", "REG124"],
  "categorizerId": "CAT001",
  "categorizerName": "categorizer1"
}
```

**DynamoDB Updates:**
- Creates records in `categorizer-assignments` table
- Updates `assignedCategorizer` in main candidates table

---

### 3. get-assigned-candidates.py
Retrieves all candidates assigned to a specific categorizer.

**Endpoint Type:** GET  
**Query Parameters:** `?categorizerId=CAT001`

**Returns:** Array of candidate objects assigned to the categorizer

---

## Deployment Instructions

### Step 1: Create DynamoDB Tables

#### Main Candidates Table
Your existing table already has these fields. Add these new columns:
- `category` (String) - The performance category
- `assignedCategorizer` (String) - Categorizer ID (CAT001-CAT010)
- `categorizedAt` (String) - ISO timestamp when categorized
- `categorizerAssignedAt` (String) - ISO timestamp when assigned to categorizer

#### New Categorizer Assignments Table
Create a new table: `categorizer-assignments`

**Schema:**
- **Partition Key (pk):** registrationId (String)
- **Sort Key (sk):** CATEGORIZER#{categorizerId} (String)

**Attributes:**
- `categorizerId` (String) - CAT001, CAT002, etc.
- `categorizerName` (String) - categorizer1, categorizer2, etc.
- `assignedAt` (String) - ISO timestamp
- `status` (String) - "pending" or "categorized"

**Optional GSI (for faster queries):**
- GSI Name: `categorizer-index`
- Partition Key: `categorizerId`
- Sort Key: `assignedAt`

---

### Step 2: Deploy Lambda Functions

For each Lambda function:

1. **Create Lambda Function in AWS Console:**
   - Runtime: Python 3.11 or 3.12
   - Architecture: x86_64
   - Timeout: 30 seconds
   - Memory: 256 MB

2. **Update Table Names:**
   - Replace `'your-candidates-table-name'` with your actual table name
   - Adjust the Key structure (`pk`, `sk`) based on your table schema

3. **Add IAM Permissions:**
   Add this policy to Lambda execution role:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "dynamodb:GetItem",
           "dynamodb:PutItem",
           "dynamodb:UpdateItem",
           "dynamodb:Query",
           "dynamodb:Scan"
         ],
         "Resource": [
           "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/YOUR_CANDIDATES_TABLE",
           "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/categorizer-assignments",
           "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/categorizer-assignments/index/*"
         ]
       }
     ]
   }
   ```

4. **Create Function URL:**
   - Enable Function URL
   - Auth type: NONE (or configure as needed)
   - CORS: Enable with `*` for development

5. **Copy the Function URL** and provide it to the frontend team

---

### Step 3: Test the Functions

#### Test update-category:
```bash
curl -X POST https://YOUR_FUNCTION_URL \
  -H "Content-Type: application/json" \
  -d '{
    "registrationId": "REG123",
    "category": "Singing",
    "assignedCategorizer": "CAT001"
  }'
```

#### Test assign-categorizer:
```bash
curl -X POST https://YOUR_FUNCTION_URL \
  -H "Content-Type: application/json" \
  -d '{
    "registrationIds": ["REG123", "REG124"],
    "categorizerId": "CAT001",
    "categorizerName": "categorizer1"
  }'
```

#### Test get-assigned-candidates:
```bash
curl "https://YOUR_FUNCTION_URL?categorizerId=CAT001"
```

---

## Database Schema Reference

### Existing Candidates Table
```
pk (Partition Key): registrationId
sk (Sort Key): CANDIDATE (if applicable)

Existing Fields:
- name
- udid
- mobile
- gender
- age
- district
- assignedto (judge assignment)
- videoUrl
- is_shortlisted
- is_winner

New Fields to Add:
- category
- assignedCategorizer
- categorizedAt
- categorizerAssignedAt
```

### New Categorizer Assignments Table
```
pk (Partition Key): registrationId
sk (Sort Key): CATEGORIZER#{categorizerId}

Fields:
- categorizerId
- categorizerName
- assignedAt
- status
```

---

## Notes

1. **Adjust Key Structure:** If your table uses different key names (e.g., `registrationId` instead of `pk`), update the Lambda code accordingly.

2. **Batch Operations:** For better performance with large datasets, consider using `batch_write_item` in the assign-categorizer function.

3. **Error Handling:** All functions include try-catch blocks and return proper HTTP status codes.

4. **CORS:** Functions are configured with CORS headers for cross-origin requests from your frontend.

5. **Logging:** All functions log to CloudWatch for debugging.
