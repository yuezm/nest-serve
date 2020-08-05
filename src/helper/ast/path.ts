import { SyntaxKind, Node } from 'typescript';

import { VisitNode, VisitNodeAttr, VisitNodeIndex, VisitPath, VisitPathChildren } from './visit';


export class Path {
  node: VisitNode;
  kind: SyntaxKind;
  isNew: boolean = false;
  visited: boolean = false;

  prev: VisitPath;
  next: VisitPath;

  parent: VisitPath;
  attr: VisitNodeAttr; // parent.attr = this;
  index: VisitNodeIndex; // parent[index] = this; 这个index是不准的，不能用

  // 以下都是子属性
  body: VisitPathChildren = null;
  statements: VisitPathChildren = null;
  members: VisitPathChildren = null;
  parameters: VisitPathChildren = null;
  type: VisitPathChildren = null;

  constructor(node: Node, parent: VisitPath, kind: SyntaxKind, attr: VisitNodeAttr, index: VisitNodeIndex) {
    this.node = node;
    this.parent = parent;
    this.kind = kind;
    this.attr = attr;
    this.index = index;
  }

  getThisIndex(): number {
    // 非数组不允许插入，根节点不允许插入,空属性不允许插入
    if (this.index === null || this.parent === null || this.attr === null) return -1;
    return this.parent[ this.attr ].findIndex((v) => v === this);
  }

  insertBefore(node: Node): void {
    const nowIndex = this.getThisIndex();
    if (nowIndex === -1) return;
    const p = new Path(node, this.parent, node.kind, null, nowIndex);
    p.isNew = true;

    p.prev = this.prev;
    p.prev && (p.prev.next = p);
    p.next = this;
    this.prev = p;

    this.parent![ this.attr! ].splice(nowIndex, 0, p);
  }

  insertAfter(node: Node): void {
    const nowIndex = this.getThisIndex();
    if (nowIndex === -1) return;
    const p = new Path(node, this.parent, node.kind, null, nowIndex + 1);
    p.isNew = true;

    p.prev = this;
    p.next && (p.next.prev = p);
    p.next = this.next;
    this.next = p;

    this.parent![ this.attr! ].splice(nowIndex + 1, 0, p);
  }

  deleteNode(): void {
    this.node = null;
  }
}