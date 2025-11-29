# Lambda Functions Deployment Guide

## ✅ Updated for Your Existing Table Structure

All Lambda functions have been updated to work with your existing setup:
- **Table Name:** `eventregistrations`
- **Region:** `ap-south-1`
- **Key Structure:** Composite keys (pk, sk)

---

## What You Need to Create

### 1. New DynamoDB Table: `categorizer-assignments`

This table tracks which candidates are assigned to which categorizers.

**Create in AWS Console:**
1. Go to DynamoDB → Tables → Create table
2. **Table name:** `categorizer-assignments`
3. **Partition key:** `pk` (String)
4. **Sort key:** `sk` (String)
5. Click "Create table"

**Optional GSI (for faster queries):**
- **GSI Name:** `categorizer-index`
- **Partition key:** `categorizerId` (String)
- **Sort key:** `assignedAt` (String)

---

## Deployment Steps

### Step 1: Deploy Lambda Functions

For each of the 3 Lambda functions, follow these steps:

#### A. Create Lambda Function

1. Go to AWS Lambda → Create function
2. **Function name:** 
   - `update-category`
   - `assign-categorizer`
   - `get-assigned-candidates`
3. **Runtime:** Node.js 18.x or 20.x
4. **Architecture:** x86_64
5. Click "Create function"

#### B. Upload Code

**Option 1: Inline Code (Quick)**
1. In the Lambda console, go to "Code" tab
2. Copy the entire content from the `.js` file
3. Paste into `index.js` in the editor
4. Click "Deploy"

**Option 2: ZIP Upload (Recommended for production)**
```bash
cd lambda-functions
npm install
zip -r update-category.zip update-category.js node_modules/
# Upload the ZIP in Lambda console
```

#### C. Configure Function

1. **Configuration → General configuration:**
   - Timeout: 30 seconds
   - Memory: 256 MB

2. **Configuration → Environment variables:** (Optional)
   - `TABLE_NAME`: `eventregistrations`
   - `REGION`: `ap-south-1`

#### D. Add IAM Permissions

1. Go to **Configuration → Permissions**
2. Click on the execution role
3. Add inline policy:

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
        "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/eventregistrations",
        "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/categorizer-assignments",
        "arn:aws:dynamodb:ap-south-1:YOUR_ACCOUNT_ID:table/categorizer-assignments/index/*"
      ]
    }
  ]
}
```

**Replace `YOUR_ACCOUNT_ID` with your AWS account ID!**

#### E. Create Function URL

1. Go to **Configuration → Function URL**
2. Click "Create function URL"
3. **Auth type:** NONE (or configure as needed)
4. **Configure CORS:**
   - Allow origin: `*`
   - Allow methods: `GET, POST, OPTIONS`
   - Allow headers: `Content-Type`
5. Click "Save"
6. **Copy the Function URL** - you'll need this for the frontend!

---

### Step 2: Test the Functions

#### Test update-category

```bash
curl -X POST https://YOUR_FUNCTION_URL \
  -H "Content-Type: application/json" \
  -d '{
    "registrationId": "REG123",
    "category": "Singing",
    "assignedCategorizer": "CAT001"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Category updated successfully to Singing",
  "data": {
    "registrationId": "REG123",
    "category": "Singing",
    "assignedCategorizer": "CAT001"
  }
}
```

#### Test assign-categorizer

```bash
curl -X POST https://YOUR_FUNCTION_URL \
  -H "Content-Type: application/json" \
  -d '{
    "registrationIds": ["REG123", "REG124"],
    "categorizerId": "CAT001",
    "categorizerName": "categorizer1"
  }'
```

#### Test get-assigned-candidates

```bash
curl "https://YOUR_FUNCTION_URL?categorizerId=CAT001"
```

---

## Step 3: Provide URLs to Frontend

After deploying all 3 functions, you'll have 3 Function URLs. Share them with me:

1. **update-category URL:** `https://xxxxx.lambda-url.ap-south-1.on.aws/`
2. **assign-categorizer URL:** `https://xxxxx.lambda-url.ap-south-1.on.aws/`
3. **get-assigned-candidates URL:** `https://xxxxx.lambda-url.ap-south-1.on.aws/`

I'll update the frontend code with these URLs!

---

## Troubleshooting

### Error: "Missing pk/sk"
- Make sure the candidate exists in the `eventregistrations` table
- Check that the item has both `pk` and `sk` fields

### Error: "AccessDeniedException"
- Check IAM permissions are correctly set
- Verify the execution role has DynamoDB access

### Error: "Table not found"
- Make sure `categorizer-assignments` table is created
- Check table name spelling

### CORS Errors
- Enable Function URL CORS settings
- Check that headers are configured correctly

---

## Next Steps

Once you deploy these functions and give me the URLs, I'll:
1. ✅ Complete the categorizer dashboard
2. ✅ Update admin panel with category features
3. ✅ Test the entire workflow end-to-end

Let me know when you have the Function URLs ready! 🚀
