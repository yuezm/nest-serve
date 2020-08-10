import { transform, transNodeToPath, transPathToNode } from './visit';
import { Node, NodeFlags, SyntaxKind, NumericLiteral } from 'typescript';
import * as ts from 'typescript';
import { execSync } from 'child_process';

import { Path } from './path';
import { updateLoadSourceFileToString } from './index';


// a = [1,1]
const constNode = ts.createVariableStatement(undefined, ts.createVariableDeclarationList([ ts.createVariableDeclaration(
  ts.createIdentifier('a'),
  undefined,
  ts.createArrayLiteral([ ts.createNumericLiteral('1'), ts.createNumericLiteral('1') ], false)) ],
  ts.NodeFlags.Const));

let p: Path;

describe('Test Visit', () => {
  it('Test transNodeToPath null', () => {
    expect(transNodeToPath(null)).toBeNull();
  });

  it('Test transNodeToPath not null', () => {
    const path = transNodeToPath(constNode);
    p = path!;

    expect(path instanceof Path).toBeTruthy();
    expect(path!.isArrayNode).toBeFalsy();
    expect(path!.isVisited).toBeFalsy();
    expect(path!.isNew).toBeFalsy();


    const declarationListPath = path!.declarationList;
    expect(declarationListPath instanceof Path).toBeTruthy();

    const declarationsPath = declarationListPath.declarations[ 0 ];
    expect(declarationsPath instanceof Path).toBeTruthy();
    expect(declarationsPath.isArrayNode).toBeTruthy();
    expect(declarationsPath.prev).toBeFalsy();
    expect(declarationsPath.next).toBeFalsy();


    const initializerNode = declarationsPath.initializer;

    expect(Array.isArray(initializerNode.elements)).toBeTruthy();
    expect(initializerNode.elements[ 0 ].next).toBe(initializerNode.elements[ 1 ]);
    expect(initializerNode.elements[ 1 ].prev).toBe(initializerNode.elements[ 0 ]);
  });


  it('Test transPathToNode null', () => {
    expect(transPathToNode(null)).toBeNull();
  });

  it('Test transPathToNode trans', () => {
    const node = transPathToNode(p);
    expect(updateLoadSourceFileToString([ node as any ])).toBe('const a = [1, 1];\n');
  });

  it('Test transPathToNode delete and trans', () => {
    (p.declarationList.declarations[ 0 ].initializer.elements[ 1 ] as Path).deleteNode();
    const node = transPathToNode(p);
    expect(updateLoadSourceFileToString([ node as any ])).toBe('const a = [1];\n');
  });

  it('Test transform null', function() {
    expect(transform(null)).toBeNull();
  });

  it('Test transform not null', function() {
    transform(p, {
      [ SyntaxKind.NumericLiteral ](p: Path) {
        if (p.node) {
          (p.node as NumericLiteral).text = '3';
        }
      },
    });

    const node = transPathToNode(p);

    expect(updateLoadSourceFileToString([ node as any ])).toBe('const a = [3];\n');
  });
});