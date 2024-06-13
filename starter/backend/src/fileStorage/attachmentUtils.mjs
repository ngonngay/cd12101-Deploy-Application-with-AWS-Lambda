import * as AWS from 'aws-sdk';
import { createLogger } from '../utils/logger';
import { Types } from 'aws-sdk/clients/s3';

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);
const log = createLogger('AttachmentUtils');

export class S3AttachmentHelper {
  constructor() {
    this.s3Client = new XAWS.S3({ signatureVersion: 'v4' });
    this.bucketName = process.env.ATTACHMENT_S3_BUCKET;
    this.urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
  }

  async generateAttachmentPresignedUrl(attachmentId) {
    const presignedUrl = this.s3Client.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: this.urlExpiration,
    });

    log.info(`Presigned URL generated: ${presignedUrl}`);
    return presignedUrl;
  }
}
