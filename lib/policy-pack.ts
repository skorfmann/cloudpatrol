import { IConstruct } from "constructs";
import { IReportable } from "./reporter";
import { Policy, PolicyContext } from "./policy";

export class PolicyPack {
  constructor(private policies: Policy[] = []) { }

  public add(policy: Policy): void {
    this.policies.push(policy)
  }

  public validate(node: IConstruct, context: PolicyContext, reporter: IReportable): void {
    this.policies.forEach((policy) => {
      policy.validate(node, reporter, context);
    });
  }
}
