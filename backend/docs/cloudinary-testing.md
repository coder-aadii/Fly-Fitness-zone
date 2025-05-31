# Cloudinary Integration Testing

This document provides instructions for testing the Cloudinary integration in the Fly Fitness Zone application.

## Prerequisites

- Node.js installed
- Backend dependencies installed (`npm install` in the backend directory)
- Cloudinary credentials configured in the `.env` file

## Testing Steps

### 1. Download a Test Image

First, download a sample test image:

```bash
npm run download-test-image
```

This will download a sample image from Cloudinary's demo account and save it as `test-image.jpg` in the backend directory.

### 2. Run the Cloudinary Upload Test

Next, run the Cloudinary upload test:

```bash
npm run test-cloudinary
```

This will:
1. Upload the test image to your Cloudinary account
2. Display the upload results, including the image URL
3. Delete the image from Cloudinary (to avoid cluttering your account)

### 3. Test with Your Own Image

You can also test with your own image by providing a path to the image:

```bash
node scripts/test-cloudinary-upload.js /path/to/your/image.jpg
```

## Expected Output

If the test is successful, you should see output similar to:

```
Starting Cloudinary upload test...
Using Cloudinary configuration:
- Cloud Name: deoegf9on
- API Key: ✓ Set
- API Secret: ✓ Set
- CLOUDINARY_URL: ✓ Set
Uploading file: /path/to/test-image.jpg

Upload successful! ✅

Cloudinary Response:
- Public ID: test-uploads/abcdefghij
- URL: http://res.cloudinary.com/deoegf9on/image/upload/v1234567890/test-uploads/abcdefghij.jpg
- Secure URL: https://res.cloudinary.com/deoegf9on/image/upload/v1234567890/test-uploads/abcdefghij.jpg
- Resource Type: image
- Format: jpg
- Size: 12345 bytes
- Created At: 5/1/2023, 12:00:00 PM

You can view your image at: https://res.cloudinary.com/deoegf9on/image/upload/v1234567890/test-uploads/abcdefghij.jpg

Testing deletion...
Deletion result: Success ✅

Test completed successfully!
```

## Troubleshooting

If the test fails, check the following:

1. **Cloudinary Credentials**: Ensure your Cloudinary credentials in the `.env` file are correct.
2. **Internet Connection**: Make sure you have an active internet connection.
3. **Cloudinary Account**: Verify that your Cloudinary account is active and has not reached its usage limits.
4. **File Format**: Ensure the image file format is supported by Cloudinary.

## Next Steps

After confirming that the Cloudinary integration works correctly, you can:

1. Run the migration script to move existing media from local storage to Cloudinary:
   ```bash
   npm run migrate
   ```

2. Start the server to test the full integration:
   ```bash
   npm run dev
   ```