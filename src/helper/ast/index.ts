import { writeFileSync } from 'fs';
import {
  createPrinter,
  createProgram,
  createSourceFile,
  updateSourceFileNode,
  createIdentifier,
  createConditional,
  createImportDeclaration,
  createImportClause,
  createNamedImports,
  createImportSpecifier,
  createStringLiteral,
  Node,
  parseCommandLine,
  ScriptTarget,
  SyntaxKind,
  ClassDeclaration,
  SourceFile,
  InterfaceDeclaration,
  Statement,
} from 'typescript';

import { transform, transNodeToPath, transPathToNode, VisitNode, VisitPath } from './visit';
import { Path } from './path';

export const prettierBaseConfig = {
  bracketSpacing: true,
  tabWidth: 2,
  semi: true,
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'all',
  jsxBracketSameLine: true,
};

export function readFileToNode(appPath: string): Node | undefined {
  const cmd = parseCommandLine([ appPath ]);
  const program = createProgram(cmd.fileNames, cmd.options);
  return program.getSourceFile(appPath);
}

export function updateLoadSourceFileToString(node: Statement[]): string {
  const printer = createPrinter();
  const sf = updateSourceFileNode(createSourceFile('code.ts', '', ScriptTarget.Latest), node);
  return printer.printFile(sf);
}

export function clearClassDefinition(root: VisitNode): VisitNode {
  if (!root) return null;

  const rootPath: VisitPath = transNodeToPath(root);
  const classDeclarationSet: Set<string> = new Set<string>();
  const deleteClassDeclarationSet: Set<string> = new Set<string>();

  transform(rootPath, {
    [ SyntaxKind.ClassDeclaration ](path: Path) {

      const nowClassName: string | undefined = (path.node as ClassDeclaration).name?.escapedText.toString();

      const prevInterfaceName: string | undefined = (path?.prev?.node as InterfaceDeclaration)?.name?.escapedText.toString();

      if (prevInterfaceName && nowClassName && 'I' + nowClassName === prevInterfaceName) {
        // 清除interface的实现类，没啥用，还占空间
        path.deleteNode();
        nowClassName && deleteClassDeclarationSet.add(nowClassName);
      } else {
        nowClassName && classDeclarationSet.add(nowClassName);
      }
    },

    // 清除完类后，需要修正方法中的引用
    [ SyntaxKind.MethodDeclaration ](path: Path) {
      transform(path, {
        [ SyntaxKind.TypeReference ](pc1: Path) {
          if ((pc1.node as any).typeName.escapedText === 'Promise') {
            (pc1.node as any).typeName.escapedText = 'Observable';

            // gRPC method 增加第二个参数
            const node: Node = createConditional(
              createIdentifier('metadata'),
              createIdentifier(''),
              createIdentifier('Metadata'));

            (pc1.parent!.parameters![ 0 ] as Path).insertAfter(node);

            // 修正返回值类型
            const methodParam = (pc1.node as any).typeArguments[ 0 ].typeName.right.escapedText.toString();
            if (methodParam) {
              (pc1.node as any).typeArguments[ 0 ].typeName.right.escapedText = 'I' + methodParam;
            }

            // 去掉回调的函数，只保留promise
            pc1.parent?.prev?.deleteNode();
          }
        },
      });
    },

    [ SyntaxKind.ModuleDeclaration ](path: Path) {
      if (classDeclarationSet.has((path.node as any).name.escapedText)) {
        // 删除多余的 namespace
        path.deleteNode();
      }
    },

    [ SyntaxKind.ImportDeclaration ](path: Path) {
      path.insertAfter(
        createImportDeclaration(
          undefined,
          undefined,
          createImportClause(
            undefined,
            createNamedImports([
              createImportSpecifier(undefined, createIdentifier('Metadata')),
            ]),
          ),
          createStringLiteral('grpc'),
        ),
      );

      path.insertAfter(
        createImportDeclaration(
          undefined,
          undefined,
          createImportClause(
            undefined,
            createNamedImports([
              createImportSpecifier(undefined, createIdentifier('Observable')),
            ]),
          ),
          createStringLiteral('rxjs'),
        ),
      );
    },
  });

  const node: VisitNode = transPathToNode(rootPath);
  if (!node) return node;
  return node;
}

// export function bootstrap(sourceFilePath: string, targetFilePath: string = sourceFilePath): void {
// const n: VisitNode = readFileToNode(sourceFilePath) as VisitNode;
// const newS = clearClassDefinition(n);

// if (newS) {
//   const f = updateLoadSourceFileToString((newS as SourceFile).statements as any);
//   writeFileFromSourceFile(f, targetFilePath);
// }
// }

// bootstrap('./erp.d.ts', './erp.d.d.ts');