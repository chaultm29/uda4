import AWS from 'aws-sdk';
import AWSXray from 'aws-xray-sdk';

const XAWS = AWSXray.captureAWS(AWS);

const s3bucketname = process.env.ATTACHMENTS_S3_BUCKET;
const urlExpire = process.env.SIGNED_URL_EXPIRE;

export class AttachmentUtils {
    constructor(
        s3 = new XAWS.S3({ signatureVersion: 'v4' }),
        bucketname = s3bucketname,
    ) {
    this.s3 = s3;
    this.bucketname = bucketname;
    }

    getAttachmentUrl(todoId) {
        return `https://${this.bucketname}.s3.amazonaws.com/${todoId}`
    }
    async getUploadUrl(todoId) {
        return await this.s3.getSignedUrlPromise('putObject', {
            Bucket: this.bucketname,
            Key: todoId,
            Expires: urlExpire
        });
    }
}
    