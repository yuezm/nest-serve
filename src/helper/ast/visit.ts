import { Node } from 'typescript';

import { Path } from './path';

export type VisitNode = Node | null;
export type VisitPath = Path | null;
export type VisitPathChildren = Path | Path[] | null;
export type VisitNodeAttr = string | null;
export type VisitNodeIndex = number | null;
export type VisitorHandle = (node: Path) => void;
export type Visitor = { [ attr: number ]: VisitorHandle };

export const KEYS = [ 'body', 'statements', 'members', 'parameters', 'type' ];

export function transform(root: VisitPath, visitor?: Visitor): VisitPath {
  if (!root) return null;

  visit(root);

  return root;

  function visit(path: VisitPathChildren): void {
    if (!path) return;

    if (Array.isArray(path)) {
      for (const p of path) {
        if (p.isNew || p.visited) continue;
        visit(p);
      }
    } else {
      // 新节点不予处理
      if (path.isNew || path.visited) return;

      // Visitor 执行处
      if (visitor && visitor[ path.kind ]) {
        visitor[ path.kind ](path);
      }

      path.visited = true;

      for (const key of KEYS) {
        // 可能会删除当前节点
        if (path.node && path[ key ]) {
          visit(path[ key ]);
        }
      }
    }
  }
}

export function transNodeToPath(root: VisitNode): VisitPath {
  if (!root) return null;
  return visit(root, null, null, null);

  function visit(node: VisitNode, parentPath: VisitPath, attr: VisitNodeAttr, index: VisitNodeIndex): VisitPath {
    if (!node) return null;

    const path = new Path(node, parentPath, node.kind, attr, index);

    for (const key of KEYS) {
      // 对子属性进行遍历，由于不清楚子属性有哪些，所以使用 KYS 数组指出
      if (node[ key ] && typeof node[ key ] === 'object') {

        const childrenNodes: Node | Node[] = node[ key ]; // 可能为数组

        if (Array.isArray(childrenNodes)) {

          // 遍历子属性，数组子节点的话，需要记录 prev,next 等信息
          path[ key ] = [];
          let prevPath: VisitPath = null;

          for (let i = 0; i < childrenNodes.length; i++) {
            const childPath: VisitPath = visit(childrenNodes[ i ], path, key, i);
            path[ key ].push(childPath);

            prevPath && (prevPath.next = childPath);
            childPath && (childPath.prev = prevPath);

            prevPath = childPath;
          }
        } else {
          // 遍历子属性，非数组的话，不存在next,prev 啥的
          path[ key ] = visit(childrenNodes, path, key, null);
        }
      }
    }
    return path;
  }
}

export function transPathToNode(root: VisitPath): VisitNode {
  if (!root) return null;
  return visit(root);

  function visit(path: VisitPath): VisitNode {
    if (!path || !path.node) {
      return null;
    }

    for (const key of KEYS) {
      if (path[ key ]) {
        const children = path[ key ];

        // 如果子集是个数组，则重新整合这个数组，并放入父的 key 中
        if (Array.isArray(children)) {
          path.node[ key ] = [];
          for (const p of children) {
            const c = visit(p);
            if (!c) continue;
            path.node[ key ].push(c);
          }
        } else {
          // 如果子不是一个数组，则直接赋值
          path.node[ key ] = visit(children);
        }
      }
    }
    return path.node;
  }
}