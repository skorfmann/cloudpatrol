import * as cdk from "@aws-cdk/core"
import { IPolicy } from "./policy";
import { Severity } from "./severity";
import { IConstruct } from "constructs";

class ViolationListItem {
  public scope: string;
  public resourceType: string;
  public violations: PolicyViolation[];
  public traces: string;

  constructor(violation: PolicyViolation) {
    this.scope = violation.scope
    this.resourceType = violation.resourceType
    this.violations = [violation]
    this.traces = violation.traces()
  }

  public add(violation: PolicyViolation): void {
    this.violations.push(violation)
  }
}

class ViolationList {
  public violationItems: { [key: string]: ViolationListItem } = {}

  constructor() {
    this.violationItems = {}
  }

  public add(violation: PolicyViolation): void {
    if (!this.violationItems[violation.scope]) {
      this.violationItems[violation.scope] = new ViolationListItem(violation)
    } else {
      this.violationItems[violation.scope].add(violation)
    }
  }

  public print(): void {
    Object.values(this.violationItems).forEach((violationItem) => {
      console.log("\x1b[1m%s\x1b[0m", `${violationItem.scope} (${violationItem.resourceType}):`)
      console.group()      
      console.log('\n-------------- Violations ------------------')
      violationItem.violations.forEach((violation) => {
        console.log(violation.message())
      })
      console.log('\n-------------- Traces ----------------------')
      console.log(violationItem.traces)
      console.groupEnd()
      console.log('')
    })
  }
}

export interface Reportable {
  generateReport(): void;
  hasViolations(): boolean;
  addInfo(node: IConstruct, policy: IPolicy, message: string): void;
  addWarning(node: IConstruct, policy: IPolicy, message: string): void;
  addError(node: IConstruct, policy: IPolicy, message: string): void;
}

interface PolicyViolationProps {
  node: any;
  policy: IPolicy;
  message: string;
  severity: Severity;
}

class PolicyViolation {
  public scope: string;
  public resourceType: string;
  private node: cdk.CfnResource;
  private policy: IPolicy;

  constructor(private props: PolicyViolationProps) {
    this.node = this.props.node as cdk.CfnResource;
    this.scope = `${this.node.node.scope}`;
    this.resourceType = this.node.cfnResourceType;
    this.policy = props.policy
  }

  public message(): string {
    return `${this.terminalColor()}${this.severity().padEnd(10, ' ')}\x1b[0m ${this.props.policy.policyName}: ${
      this.props.message
    } - ${this.policy.link}`;
  }

  public traces(): string {
    const cwd = process.cwd();
    const localTraces = this.node.node.metadata[0].trace?.filter((trace) =>
      trace.match(cwd)
    );
    return (localTraces || []).join("\n")
  }

  private terminalColor(): string {
    switch (this.props.severity) {
      case Severity.INFO:
        return "\x1b[36m";
      case Severity.WARNING:
        return "\x1b[33m";
      case Severity.ERROR:
        return "\x1b[31m";
      default:
        throw new Error(`${this.props.severity} not implemented`);
    }
  }

  private severity(): string {
    return `[${this.props.severity}]`
  }
}

export class TerminalReporter implements Reportable {
  private violations: ViolationList
  constructor() {
    this.violations = new ViolationList()
  }

  public generateReport(): void {
    console.log("\x1b[4m\x1b[35;1mCloud Patrol Report\x1b[0m\n");
    this.violations.print()  
  }

  public hasViolations(): boolean {
    for (const values in Object.values(this.violations)) {
      if (values && values.length > 0) return true;
    }
    return false;
  }
  public addInfo(node: IConstruct, policy: IPolicy, message: string): void {
    this.reportViolation(node, policy, message, Severity.INFO);
  }
  public addWarning(node: IConstruct, policy: IPolicy, message: string): void {
    this.reportViolation(node, policy, message, Severity.WARNING);
  }
  public addError(node: IConstruct, policy: IPolicy, message: string): void {
    this.reportViolation(node, policy, message, Severity.ERROR);
  }
  private reportViolation(node: IConstruct, policy: IPolicy, message: string, severity: Severity): void {
    this.violations.add(
      new PolicyViolation({
        node,
        policy,
        message,
        severity,
      })
    );
  }
}
