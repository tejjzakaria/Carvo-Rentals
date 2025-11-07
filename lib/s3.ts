import { S3Client } from '@aws-sdk/client-s3'

// Check if credentials are configured
export const isS3Configured = () => {
  return !!(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_REGION &&
    process.env.AWS_S3_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID !== 'your-aws-access-key-id' &&
    process.env.AWS_SECRET_ACCESS_KEY !== 'your-aws-secret-access-key' &&
    process.env.AWS_S3_BUCKET_NAME !== 'your-bucket-name'
  )
}

let s3Client: S3Client | null = null
let S3_BUCKET_NAME: string | null = null

if (isS3Configured()) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
  S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!
}

export { s3Client, S3_BUCKET_NAME }
