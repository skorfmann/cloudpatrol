import * as ec2 from '@aws-cdk/aws-ec2';
import { Policy } from '../../lib/policy';
import { IReportable } from '../../lib/reporter';

export interface Ec2InstanceTypePolicyConfig {
  instanceClasses?: ec2.InstanceClass[];
  instanceSizes?: ec2.InstanceSize[];
}

/**
 * This Policy ensures that we're using instances of a certain instance type
 *
 *
 * @cloudformationResource AWS::EC2::Instance
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-instancetype
 */
export class Ec2InstanceTypePolicy extends Policy {
  public policyName = 'Ec2InstanceType'
  public description = 'This Policy ensures that we\'re using instances of a certain class';
  public link = 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance.html#cfn-ec2-instance-instancetype';
  public scope = ec2.CfnInstance

  public instanceClasses?: ec2.InstanceClass[];
  public instanceSizes?: ec2.InstanceSize[];

  constructor(public config: Ec2InstanceTypePolicyConfig) {
    super()
    this.instanceClasses = config.instanceClasses
    this.instanceSizes = config.instanceSizes
  }

  public validator(node: ec2.CfnInstance, reporter: IReportable): void {
    if (this.instanceTypes().find(instanceType => node.instanceType?.includes(instanceType)) === undefined) {
      reporter.addInfo(node, this, `Please consider using instances from the following types ${this.instanceTypes()}`);
    }
  }

  private instanceTypes(): string[] {
    if (Array.isArray(this.instanceClasses)) {
      return this.instanceClasses.map((c: any) => {
        return (this.instanceSizes && this.instanceSizes.map(s => `${c}.${s}`) || [`${c}.`])
      }).reduce((acc, val) => acc.concat(val), []);
    } else if (Array.isArray(this.instanceSizes)) {
      return this.instanceSizes
    } else {
      return []
    }
  }
}
