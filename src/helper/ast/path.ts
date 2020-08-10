import { SyntaxKind, Node } from 'typescript';

import { VisitNode, VisitNodeAttr, VisitPath, VisitPathChildren } from './visit';


export class Path {
  node: VisitNode;
  kind: SyntaxKind;
  isNew: boolean = false;
  isVisited: boolean = false;
  isArrayNode: boolean = false;

  prev: VisitPath;
  next: VisitPath;

  parent: VisitPath;
  attr: VisitNodeAttr; // parent.attr = this;

  // 以下都是子属性
  [ key: string ]: VisitPathChildren | any;

  constructor(node: Node, parent: VisitPath, kind: SyntaxKind, attr: VisitNodeAttr) {
    this.node = node;
    this.parent = parent;
    this.kind = kind;
    this.attr = attr;
  }

  getThisIndex(): number {
    // 非数组不允许插入，根节点不允许插入,空属性不允许插入
    if (!this.isArrayNode || this.parent === null || this.attr === null) return -1;
    return this.parent[ this.attr ].findIndex((v) => v === this);
  }

  insertBefore(node: Node): void {
    const nowIndex = this.getThisIndex();
    if (nowIndex === -1) return;

    const p = new Path(node, this.parent, node.kind, null);
    p.isNew = true;
    p.isArrayNode = true;

    this.parent![ this.attr! ].splice(nowIndex, 0, p);

    p.prev = this.prev;
    p.prev && (p.prev.next = p);
    p.next = this;
    this.prev = p;
  }

  insertAfter(node: Node): void {
    const nowIndex = this.getThisIndex();
    if (nowIndex === -1) return;

    const p = new Path(node, this.parent, node.kind, null);
    p.isNew = true;
    p.isArrayNode = true;

    this.parent![ this.attr! ].splice(nowIndex + 1, 0, p);

    p.prev = this;
    p.next && (p.next.prev = p);
    p.next = this.next;
    this.next = p;
  }

  deleteNode(): void {
    this.node = null;
  }
}