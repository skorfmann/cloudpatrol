import { Resource } from "@aws-cdk/core"
import { Reportable } from "./reporter";
import { IPolicy } from "./policy"

export class AwsCdkReporter implements Reportable {
  private violations: Resource[] = []

  public generateReport(): void {
    // noop
  }

  public hasViolations(): boolean {
    return this.violations.length > 0
  }

  public addInfo(node: Resource, policy: IPolicy, message: string): void {
    this.violations.push(node)
    node.node.addInfo(message)
  }

  public addWarning(node: Resource, policy: IPolicy, message: string): void {
    this.violations.push(node)
    node.node.addWarning(message)
  }

  public addError(node: Resource, policy: IPolicy, message: string): void {
    this.violations.push(node)
    node.node.addError(message)
  }
}