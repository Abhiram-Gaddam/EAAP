import { S3Client, PutObjectCommand , DeleteObjectsCommand, ListObjectsV2Command , ListObjectsV2CommandOutput, DeleteObjectCommand} from '@aws-sdk/client-s3';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// ORIGINAL FUNCTION (Left exactly as is so nothing else breaks)
export async function uploadToS3(file: File, userId: string, docType: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split('.').pop();
  
  const fileKey = `users/${userId}/${docType}_${Date.now()}.${fileExtension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return fileKey;
}

// NEW FUNCTION (Added specifically for custom folders like Events and Certificates)
export async function uploadToS3CustomPath(file: File, pathPrefix: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split('.').pop();
  
  const fileKey = `${pathPrefix}_${Date.now()}.${fileExtension}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
}
export async function getPresignedUrl(s3UrlOrKey: string | null): Promise<string | null> {
  if (!s3UrlOrKey) return null;
  
  // Extract the exact file key from the stored URL
  let fileKey = s3UrlOrKey;
  if (s3UrlOrKey.includes('.amazonaws.com/')) {
    fileKey = decodeURIComponent(s3UrlOrKey.split('.amazonaws.com/')[1]);
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
  });

  // Generate a URL that is only valid for 2 hour
  return await getSignedUrl(s3, command, { expiresIn: 7200 });
}

export async function deleteS3Folder(prefix: string): Promise<void> {
  let isTruncated: boolean | undefined = true;
  let continuationToken: string | undefined = undefined;

  while (isTruncated) {
    // Explicitly cast the response to the AWS SDK type
    const listResponse: ListObjectsV2CommandOutput = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      })
    );

    if (!listResponse.Contents || listResponse.Contents.length === 0) break;

    // Explicitly define 'item' as 'any' (or you could import _Object from aws-sdk)
    const objectsToDelete = listResponse.Contents.map((item: any) => ({ Key: item.Key }));

    await s3.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Delete: { Objects: objectsToDelete },
      })
    );

    isTruncated = listResponse.IsTruncated;
    continuationToken = listResponse.NextContinuationToken;
  }
}

export async function deleteS3Object(s3Url: string): Promise<void> {
  if (!s3Url.includes('.amazonaws.com/')) return;
  const fileKey = decodeURIComponent(s3Url.split('.amazonaws.com/')[1]);
  
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileKey,
    })
  );
}