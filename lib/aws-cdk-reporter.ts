import { Resource } from "@aws-cdk/core"
import { IReportable } from "./reporter";
import { Policy } from "./policy"
import { IConstruct } from "constructs";

export class AwsCdkReporter implements IReportable {
  private violations: Resource[] = []

  public generateReport(): void {
    // noop
  }

  public hasViolations(): boolean {
    return this.violations.length > 0
  }

  public addInfo(node: IConstruct, _policy: Policy, message: string): void {
    const resource = node as Resource;
    this.violations.push(resource)
    resource.node.addInfo(message)
  }

  public addWarning(node: IConstruct, _policy: Policy, message: string): void {
    const resource = node as Resource;
    this.violations.push(resource)
    resource.node.addWarning(message)
  }

  public addError(node: IConstruct, _policy: Policy, message: string): void {
    const resource = node as Resource;
    this.violations.push(resource)
    resource.node.addError(message)
  }
}