export interface INameSerialization {
  path: string; // 路径名，例如 user、user.role
  name: string; // 序列化后的名称，例如 user、userRole
  nameHump: string; // 序列化后的大驼峰命名，例如 User、UserRole
}

// 名称序列化
export function serializePathName(moduleName: string): INameSerialization {
  const data: INameSerialization = { path: moduleName, name: moduleName, nameHump: '' };

  if (/.*?[-.]$/.test(moduleName)) {
    throw new Error('错误模块名');
  }

  // 可能存在含有短横线的名称
  if (moduleName.includes('-')) {
    // user-role => user.role
    data.path = moduleName.replace(/-/g, '.');

    // user-role => userRole
    data.name = moduleName.replace(/-(\w)?/g, (p1, p2) => p2.toUpperCase());
  }

  data.nameHump = toHumpString(data.name);

  return data;
}

// 字符串转大驼峰
export function toHumpString(s: string): string {
  return s === '' ? '' : s.replace(s[ 0 ], s[ 0 ].toUpperCase());
}

export * from './template';

export * from './ast';