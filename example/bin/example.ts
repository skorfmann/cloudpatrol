#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ExampleStack } from '../lib/example-stack';
import { AwsCdkPatrol } from 'cloudpatrol/dist/lib'
import { awsDefaults } from 'cloudpatrol/dist/policies/aws/packs/good-defaults'
import { Ec2InstanceTypePolicy } from 'cloudpatrol/dist/policies/aws';
import * as ec2 from '@aws-cdk/aws-ec2'

const app = new cdk.App();
const stack = new ExampleStack(app, 'ExampleStack');

awsDefaults.add(new Ec2InstanceTypePolicy({
  instanceClasses: [
    ec2.InstanceClass.T3,
    ec2.InstanceClass.T3A, 
  ],
  instanceSizes: [
    ec2.InstanceSize.SMALL, 
    ec2.InstanceSize.MEDIUM,
    ec2.InstanceSize.LARGE
  ]
}))

const cloudPatrol = new AwsCdkPatrol(awsDefaults)
cloudPatrol.check(stack)
