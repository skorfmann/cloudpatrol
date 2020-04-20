import * as cdk from "@aws-cdk/core";
import * as s3 from '@aws-cdk/aws-s3';
import { Policy } from '../../lib/policy';
import { IReportable } from '../../lib/reporter';

/**
 * This Policy ensures that a bucket is properly versioned
 *
 * @cloudformationResource AWS::S3::Bucket
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html
 */
export class BucketVersioningPolicy extends Policy {
  public policyName = 'Bucket Versioning'
  public description = 'This ensures that a bucket is properly versioned'
  public link = 'https//docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-versioningconfig.html'
  public scope = s3.CfnBucket

  public validator(node: s3.CfnBucket, reporter: IReportable): void {
    if (!node.versioningConfiguration ||
      (!cdk.Tokenization.isResolvable(node.versioningConfiguration) && node.versioningConfiguration.status !== 'Enabled')) {
      reporter.addWarning(node, this, 'Bucket versioning is not enabled');
    }
  }
}

/**
 * This Policy ensures that a bucket is properly encrypted
 *
 * @cloudformationResource AWS::S3::Bucket
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html
 */
export class BucketEncryptionPolicy extends Policy {
  public policyName = 'Bucket Encryption'
  public description = 'This Policy ensures that a bucket is properly encrypted'
  public link = 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-bucketencryption.html'
  public scope = s3.CfnBucket

  public validator(node: s3.CfnBucket, reporter: IReportable): void {
    if (!node.bucketEncryption || (!cdk.Tokenization.isResolvable(node.bucketEncryption))) {
      reporter.addError(node, this, 'Bucket encryption is not enabled. Please consider to add encryption');
    }
  }
}