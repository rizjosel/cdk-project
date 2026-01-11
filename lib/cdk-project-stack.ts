import * as cdk from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkProjectStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //L1 and L2 Construct of an S3 Bucket
    const level1S3Bucket = new CfnBucket(this, 'MyFirstLevel1ConstructBucket',{
      versioningConfiguration:{
        status: "Enabled"
      }
    });
    const level2S3Bucket = new Bucket(this, 'MyFirstLevel2ConstructBucket',{
      versioned: true
    });

    const vpc = new ec2.Vpc(this, 'FreeTierVPC', {
      maxAzs: 2, // limit to 2 AZs for cost
    });

    const sg = new ec2.SecurityGroup(this, 'EC2SG', {
      vpc,
      allowAllOutbound: true,
      description: 'Allow SSH and HTTP access',
    });

    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
    sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');

    const keyName = 'cli-user';

    const ec2Instance = new ec2.Instance(this, 'FreeTierEC2', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO), // Free Tier
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      securityGroup: sg,
      keyName, // must exist in AWS
    });

    ec2Instance.userData.addCommands(
      'sudo yum update -y',
      'sudo amazon-linux-extras install nginx1 -y',
      'sudo systemctl enable nginx',
      'sudo systemctl start nginx'
    );

    new cdk.CfnOutput(this, 'EC2PublicIP', {
      value: ec2Instance.instancePublicIp,
    });
    // The code that defines your stack goes here
    // example resource
    // const queue = new sqs.Queue(this, 'CdkProjectQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
