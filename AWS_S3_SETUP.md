# AWS S3 Setup Guide for Vehicle Images

This guide will help you set up AWS S3 for storing vehicle images in your Carvo application.

## Prerequisites
- An AWS account (sign up at https://aws.amazon.com)

## Step 1: Create an S3 Bucket

1. Go to the [AWS S3 Console](https://s3.console.aws.amazon.com/s3/)
2. Click **"Create bucket"**
3. Configure your bucket:
   - **Bucket name**: Choose a unique name (e.g., `carvo-vehicle-images`)
   - **AWS Region**: Choose the region closest to your users (e.g., `us-east-1`)
   - **Block Public Access settings**: UNCHECK "Block all public access"
     - ⚠️ We need public access so vehicle images can be displayed on your website
   - Acknowledge the warning about public access
4. Click **"Create bucket"**

## Step 2: Configure Bucket for Public Read Access

1. Click on your newly created bucket
2. Go to the **"Permissions"** tab
3. Scroll to **"Bucket policy"** and click **"Edit"**
4. Paste the following policy (replace `your-bucket-name` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

5. Click **"Save changes"**

## Step 3: Enable CORS (Cross-Origin Resource Sharing)

1. Still in the **"Permissions"** tab, scroll to **"Cross-origin resource sharing (CORS)"**
2. Click **"Edit"**
3. Paste the following CORS configuration:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

4. Click **"Save changes"**

## Step 4: Create IAM User with S3 Access

1. Go to the [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Click **"Users"** in the left sidebar
3. Click **"Create user"**
4. Enter username: `carvo-s3-uploader`
5. Click **"Next"**
6. Select **"Attach policies directly"**
7. Search for and select **"AmazonS3FullAccess"**
   - For production, you should create a custom policy with limited permissions to only your bucket
8. Click **"Next"** and then **"Create user"**

## Step 5: Generate Access Keys

1. Click on the user you just created (`carvo-s3-uploader`)
2. Go to the **"Security credentials"** tab
3. Scroll to **"Access keys"** and click **"Create access key"**
4. Select **"Application running outside AWS"**
5. Click **"Next"**
6. (Optional) Add a description tag
7. Click **"Create access key"**
8. **IMPORTANT**: Copy both:
   - **Access key ID**
   - **Secret access key**

   ⚠️ You won't be able to see the secret key again after this step!

## Step 6: Update Your Environment Variables

Update your `.env` file with the AWS credentials:

```env
AWS_ACCESS_KEY_ID="your-access-key-id"
AWS_SECRET_ACCESS_KEY="your-secret-access-key"
AWS_REGION="us-east-1"  # or your chosen region
AWS_S3_BUCKET_NAME="your-bucket-name"
```

## Step 7: Restart Your Application

After updating the `.env` file, restart your Next.js development server:

```bash
npm run dev
```

## Testing the Upload

1. Go to **Add New Vehicle** page in your admin panel
2. Click on the **Vehicle Images** upload area
3. Select one or more images (PNG, JPG, WebP up to 5MB each)
4. The images should upload to S3 and display in the form
5. Submit the form to save the vehicle with the images

## Troubleshooting

### "AWS credentials are not configured" error
- Make sure all four AWS environment variables are set in your `.env` file
- Restart your development server after updating `.env`

### Images upload but don't display
- Check your S3 bucket policy allows public read access
- Verify the bucket policy `Resource` matches your bucket name
- Check CORS is configured correctly

### "Access Denied" when uploading
- Verify your IAM user has S3 write permissions
- Check that the access keys are correct in your `.env` file
- Make sure the region in `.env` matches your bucket's region

### Images not loading (404 error)
- Check the image URL format is correct
- Verify the S3 bucket name in the URL matches your actual bucket

## Security Best Practices (Production)

For production environments, consider:

1. **Use a custom IAM policy** instead of `AmazonS3FullAccess`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

2. **Use CloudFront** CDN in front of S3 for better performance and security

3. **Set up lifecycle rules** to automatically archive or delete old images

4. **Enable versioning** for backup and recovery

5. **Monitor costs** - S3 charges for storage and data transfer

## Need Help?

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS IAM Documentation](https://docs.aws.amazon.com/iam/)
- [S3 Pricing](https://aws.amazon.com/s3/pricing/)
