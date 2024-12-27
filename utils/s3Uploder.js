const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { fromIni, fromEnv } = require("@aws-sdk/credential-providers");

const credentials = fromIni({ profile: "s3_login" });

const fileUpload = async (file, onProgress) => {
  if (!file) return null;

  // Generate a unique name for the file
  const generateUniqueFileName = (originalFileName) => {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}-${originalFileName}`;
  };

  // Initialize the S3 bucket
  const s3BucketName = process.env.AWS_BUCKET_NAME;
  const s3BucketRegion = process.env.AWS_BUCKET_REGION;
  const s3 = new S3Client({ region: s3BucketRegion, credentials: fromEnv() });

  try {
    // Set up the upload parameters with progress tracking
    const uploadParams = new Upload({
      client: s3,
      params: {
        Bucket: s3BucketName,
        Key: generateUniqueFileName(file.originalname),
        Body: file.buffer,
        ContentType: file.mimetype,
      },
      // Optional: Track the progress of the upload
      queueSize: 1,
      leavePartsOnError: false,
    });

    // Handle progress updates
    uploadParams.on('httpUploadProgress', (progress) => {
      if (onProgress && progress.total) {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        onProgress(percentage); // Call the progress callback
      }
    });

    // Perform the upload
    const result = await uploadParams.done();

    // Return the location of the uploaded file
    return result.Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error uploading file to S3');
  }
};

module.exports = fileUpload;
