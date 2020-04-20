import { IConstruct } from "constructs";
import { IReportable } from "./reporter";

export interface PolicyContext {
  [key: string]: any;
}

/*
  Policy
*/
export abstract class Policy {
  public policyName = '';
  public description = '';
  public link = '';
  public scope?: IConstruct
  public abstract validator(node: IConstruct, reporter: IReportable, context: PolicyContext): void

  public validate(node: IConstruct, reporter: IReportable, context: PolicyContext): void {
    if (this.isApplicable(node)) {
      this.validator(node, reporter, context);
    }
  }

  /*
    Checks if the policy is applicable to a given node. Can be overwritten in descendants to implement
    custom logic.
  */
  public isApplicable(node: IConstruct): boolean {
    if (!this.scope) throw new Error('If Policy.scope is not defined, `isApplicable` has to be overwritten');

    // instanceof doesn't work reliably here. Probably need a better check than this.
    // Plus an ugly hack: tsc was complaining `Property 'prototype' does not exist on type`
    return node.constructor.name === (this.scope as any).prototype.constructor.name
  }
}

