import * as cdk from "@aws-cdk/core";
import { IConstruct, IAspect } from "constructs";
import { Reportable, TerminalReporter } from "./reporter";
import { AwsCdkReporter } from "./aws-cdk-reporter"
import { PolicyPack } from "./policy-pack";
import { PolicyContext } from "./policy";

export class AwsCdkPatrol implements IAspect {
  private readonly reporter: Reportable;
  
  constructor(private readonly policies: PolicyPack, private context: PolicyContext = {}) {
    this.reporter = this.isSynthesizing() ? new AwsCdkReporter() : new TerminalReporter()
  }

  public visit(node: IConstruct): void {
    this.policies.validate(node, this.context, this.reporter);
  }

  public check(stack: cdk.Stack): boolean {
    stack.node.applyAspect(this);
    cdk.ConstructNode.prepare(stack.node);
    this.reporter.generateReport();
    return this.reporter.hasViolations();
  }

  private isSynthesizing(): boolean {
    return process.env.CDK_CLI_VERSION !== undefined
  }
}
