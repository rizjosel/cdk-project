import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //L1 and L2 Construct of an S3 Bucket
    const level1S3Bucket = new CfnBucket(this, MyFirstLevel1ConstructBucket{
      versioningConfiguration:{
        status: "Enabled"
      }
    });
    const level2S3Bucket = new Bucket(this, MyFirstLevel2ConstructBucket{
      versioned: true
    });
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkProjectQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
