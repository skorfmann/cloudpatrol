import { BucketVersioningPolicy, BucketEncryptionPolicy } from '..';
import { PolicyPack } from '../../../lib/policy-pack';

/**
 * This `awsDefaults` pack aims to provide practical and sane defaults, so you don't shoot yourself into the foot.
 */
export const awsDefaults = new PolicyPack([ 
  new BucketVersioningPolicy(),
  new BucketEncryptionPolicy()
]);
