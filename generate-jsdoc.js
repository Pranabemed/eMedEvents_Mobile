/**
 * Repo-wide JSDoc generator.
 *
 * Scans the application, Storybook, and test sources for undocumented
 * declarations, then inserts concise JSDoc blocks without changing runtime
 * behavior.
 */
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const ROOT = __dirname;
const TARGET_DIRS = ['src', '__tests__', '.rnstorybook'];
const ROOT_FILES = [
  'App.js',
  'index.js',
  'generate-docs.js',
  'generate-docs-screens.js',
  'testDebug.js',
  'testValidation.js',
  'react-native.config.js',
  'babel.config.js',
  'metro.config.js',
  'jest.config.js',
  'jest.setup.js',
  '.eslintrc.js',
  '.prettierrc.js',
];
const EXCLUDED_PARTS = new Set(['node_modules', '.git', 'android', 'ios', 'build', 'coverage', 'dist']);
const TARGET_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);

function walk(directory, output) {
  if (!fs.existsSync(directory)) return output;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (EXCLUDED_PARTS.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, output);
      continue;
    }
    if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
      output.push(fullPath);
    }
  }
  return output;
}

function collectFiles() {
  const files = [];
  for (const dir of TARGET_DIRS) {
    walk(path.join(ROOT, dir), files);
  }
  for (const file of ROOT_FILES) {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath) && TARGET_EXTENSIONS.has(path.extname(file))) {
      files.push(fullPath);
    }
  }
  return Array.from(new Set(files));
}

function parseSource(source, filename) {
  return parser.parse(source, {
    sourceType: 'module',
    sourceFilename: filename,
    errorRecovery: true,
    plugins: [
      'jsx',
      'typescript',
      'classProperties',
      'classPrivateProperties',
      'classPrivateMethods',
      'decorators-legacy',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'logicalAssignment',
      'nullishCoalescingOperator',
      'optionalChaining',
      'objectRestSpread',
      'privateIn',
      'topLevelAwait',
      'asyncGenerators',
    ],
  });
}

function humanize(name = '') {
  return String(name)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function titleize(name = '') {
  const text = humanize(name);
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function inferSimpleType(param) {
  if (!param) return '*';
  if (param.type === 'AssignmentPattern') {
    const right = param.right;
    if (!right) return '*';
    if (right.type === 'StringLiteral' || right.type === 'TemplateLiteral') return 'string';
    if (right.type === 'NumericLiteral') return 'number';
    if (right.type === 'BooleanLiteral') return 'boolean';
    if (right.type === 'ArrayExpression') return 'Array';
    if (right.type === 'ObjectExpression') return 'Object';
    return inferSimpleType(param.left);
  }
  if (param.type === 'RestElement') return 'Array';
  if (param.type === 'ObjectPattern') return 'Object';
  if (param.type === 'ArrayPattern') return 'Array';
  if (param.type === 'Identifier') {
    const name = param.name.toLowerCase();
    if (name.includes('count') || name.includes('index') || name.includes('num') || name.includes('size') || name.includes('length')) {
      return 'number';
    }
    if (name.startsWith('is') || name.startsWith('has') || name.startsWith('should')) {
      return 'boolean';
    }
    return '*';
  }
  return '*';
}

function inferReturnType(node, meta) {
  if (meta.returnsJSX) return 'JSX.Element';
  if (meta.returnsPromise) return 'Promise<*>';
  if (meta.returnsVoid) return 'void';
  if (meta.returnsArray) return 'Array';
  if (meta.returnsObject) return 'Object';
  if (meta.returnsBoolean) return 'boolean';
  if (meta.returnsString) return 'string';
  if (meta.returnsNumber) return 'number';
  if (meta.isComponent) return 'JSX.Element';
  if (meta.isHook) return 'unknown';
  if (meta.isReducer) return 'Object';
  if (meta.isConstant) return '*';
  return '*';
}

function buildMeta(filePath, node, name) {
  const lowerPath = filePath.toLowerCase();
  const base = path.basename(filePath, path.extname(filePath));
  const lowerBase = base.toLowerCase();
  const meta = {
    isComponent: false,
    isHook: false,
    isReducer: lowerPath.includes('/redux/reducers/') || lowerBase.endsWith('reducer'),
    isSaga: lowerPath.includes('/redux/saga/') || lowerBase.endsWith('saga'),
    isScreen: lowerPath.includes('/screen/'),
    isHelper: lowerPath.includes('/utils/helpers/'),
    isNavigation: lowerPath.includes('/navigator/'),
    isConstant: false,
    returnsJSX: false,
    returnsPromise: Boolean(node.async),
    returnsVoid: false,
    returnsArray: false,
    returnsObject: false,
    returnsBoolean: false,
    returnsString: false,
    returnsNumber: false,
  };

  if (name && /^[A-Z]/.test(name)) meta.isComponent = true;
  if (name && /^use[A-Z0-9_]/.test(name)) meta.isHook = true;
  if (!name && meta.isScreen) meta.isComponent = true;
  if (name && /^initial[A-Z_]?/i.test(name)) meta.isConstant = true;
  if (name && /^[A-Z0-9_]+$/.test(name)) meta.isConstant = true;
  if (node.type === 'ClassDeclaration') meta.isComponent = true;
  return meta;
}

function gatherReturnSignals(node) {
  const meta = {
    returnsJSX: false,
    returnsPromise: Boolean(node.async),
    returnsVoid: true,
    returnsArray: false,
    returnsObject: false,
    returnsBoolean: false,
    returnsString: false,
    returnsNumber: false,
  };

  const inspectExpression = expr => {
    if (!expr) return;
    meta.returnsVoid = false;
    if (expr.type === 'JSXElement' || expr.type === 'JSXFragment') meta.returnsJSX = true;
    if (expr.type === 'ArrayExpression') meta.returnsArray = true;
    if (expr.type === 'ObjectExpression') meta.returnsObject = true;
    if (expr.type === 'BooleanLiteral') meta.returnsBoolean = true;
    if (expr.type === 'StringLiteral' || expr.type === 'TemplateLiteral') meta.returnsString = true;
    if (expr.type === 'NumericLiteral') meta.returnsNumber = true;
  };

  if (node.type === 'ArrowFunctionExpression' && node.body && node.body.type !== 'BlockStatement') {
    inspectExpression(node.body);
  }

  const body = node.body && node.body.body ? node.body.body : [];
  for (const statement of body) {
    if (statement.type === 'ReturnStatement') {
      inspectExpression(statement.argument);
    }
    if (statement.type === 'ThrowStatement') {
      meta.returnsVoid = false;
    }
  }

  return meta;
}

function describeFunction(name, filePath, meta, params = []) {
  const title = titleize(name || path.basename(filePath, path.extname(filePath)));
  if (meta.isComponent) {
    return `${title} component.`;
  }
  if (meta.isHook || /^use[A-Z0-9_]/.test(name || '')) {
    return `Custom hook that manages ${humanize((name || '').replace(/^use/, '')) || 'shared state'}.`;
  }
  if (meta.isSaga) {
    return `Redux-Saga worker for ${humanize((name || '').replace(/Saga$/, '')) || 'the current domain'}.`;
  }
  if (meta.isReducer) {
    return `Reducer logic for ${humanize((name || '').replace(/Reducer$/, '')) || 'the current slice'} state.`;
  }
  if (meta.isNavigation) {
    return `Navigation helper that exposes ${humanize(name || title) || 'route'} behavior.`;
  }
  if (meta.isHelper) {
    return `${title} utility helper.`;
  }
  if (/^get[A-Z0-9_]/.test(name || '')) {
    return `Returns ${humanize((name || '').replace(/^get/, '')) || 'a computed value'}.`;
  }
  if (/^is[A-Z0-9_]/.test(name || '')) {
    return `Determines whether ${humanize((name || '').replace(/^is/, '')) || 'the current condition'} is true.`;
  }
  if (/^handle[A-Z0-9_]/.test(name || '')) {
    return `Handles ${humanize((name || '').replace(/^handle/, '')) || 'the current event'}.`;
  }
  if (/^format[A-Z0-9_]/.test(name || '')) {
    return `Formats ${humanize((name || '').replace(/^format/, '')) || 'the provided value'}.`;
  }
  if (/^normalize[A-Z0-9_]/.test(name || '')) {
    return `Normalizes ${humanize((name || '').replace(/^normalize/, '')) || 'the provided value'}.`;
  }
  if (/^parse[A-Z0-9_]/.test(name || '')) {
    return `Parses ${humanize((name || '').replace(/^parse/, '')) || 'the provided value'}.`;
  }
  if (params.length > 0) {
    return `${title} helper.`;
  }
  return `${title} utility.`;
}

function describeFile(filePath, exportedNames) {
  const lowerPath = filePath.toLowerCase();
  const base = path.basename(filePath, path.extname(filePath));
  const label = titleize(base);
  const exportsLine = exportedNames.length ? ` Exported members: ${exportedNames.join(', ')}.` : '';
  if (lowerPath.includes('/redux/reducers/')) {
    return `${label} Redux slice module. Manages application state and exposes action creators for ${humanize(base).replace(/ reducer$/, '') || 'the slice'}.${exportsLine}`;
  }
  if (lowerPath.includes('/redux/saga/')) {
    return `${label} Redux-Saga module. Coordinates side effects, API calls, and watcher registration for ${humanize(base).replace(/ saga$/, '') || 'the domain'}.${exportsLine}`;
  }
  if (lowerPath.includes('/utils/helpers/')) {
    return `${label} utility module. Collects reusable helper functions and constants for shared application behavior.${exportsLine}`;
  }
  if (lowerPath.includes('/navigator/')) {
    return `${label} navigation module. Exposes route helpers and navigation references used across the app.${exportsLine}`;
  }
  if (lowerPath.includes('/components/')) {
    return `${label} reusable component module. Provides a React Native UI building block used across screens.${exportsLine}`;
  }
  if (lowerPath.includes('/screen/')) {
    return `${label} screen module. Renders a React Native screen or a screen-scoped support component.${exportsLine}`;
  }
  if (lowerPath.includes('/__tests__/')) {
    return `${label} test module. Verifies the behavior of the associated screen, component, or helper.${exportsLine}`;
  }
  if (lowerPath.includes('.rnstorybook')) {
    return `${label} Storybook module. Defines stories and controls for component previews.${exportsLine}`;
  }
  if (base === 'App') {
    return `Application root module. Sets up the app shell, providers, and navigation container.${exportsLine}`;
  }
  return `${label} module. Contains application logic, configuration, or shared helpers.${exportsLine}`;
}

function getCommentIndent(source, start) {
  const lineStart = source.lastIndexOf('\n', start - 1) + 1;
  return source.slice(lineStart, start).match(/^\s*/)?.[0] || '';
}

function hasLeadingJsdoc(source, comments, start) {
  return comments.some(comment => {
    if (comment.end > start) return false;
    const between = source.slice(comment.end, start);
    return comment.type === 'CommentBlock' && comment.value.startsWith('*') && /^\s*$/.test(between);
  });
}

function buildFunctionDoc(source, filePath, name, node, meta) {
  const params = [];
  for (const param of node.params || []) {
    if (param.type === 'ObjectPattern') {
      params.push({ name: 'props', type: 'Object', nested: param.properties.map(p => p.key?.name || p.key?.value).filter(Boolean) });
      continue;
    }
    if (param.type === 'Identifier') {
      params.push({ name: param.name, type: inferSimpleType(param) });
      continue;
    }
    if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
      params.push({ name: param.left.name, type: inferSimpleType(param) });
      continue;
    }
    if (param.type === 'RestElement' && param.argument.type === 'Identifier') {
      params.push({ name: param.argument.name, type: 'Array' });
      continue;
    }
    params.push({ name: 'input', type: '*' });
  }

  const signals = gatherReturnSignals(node);
  const returnType = inferReturnType(node, { ...meta, ...signals });
  const lines = ['/**', ` * ${describeFunction(name, filePath, { ...meta, ...signals }, params)}`];
  if (node.async) {
    lines.push(' *');
    lines.push(' * @async');
  }
  for (const param of params) {
    lines.push(` * @param {${param.type}} ${param.name} - ${param.name === 'props' ? 'Component props.' : 'Input value.'}`);
    if (param.nested && param.nested.length) {
      for (const nestedName of param.nested) {
        lines.push(` * @param {*} ${param.name}.${nestedName} - Nested property value.`);
      }
    }
  }
  lines.push(` * @returns {${returnType}}`);
  if (signals.returnsVoid && !node.async && params.length === 0) {
    lines.push(' *');
    lines.push(' * @remarks Does not return a value.');
  }
  lines.push(' */');
  return lines.join('\n');
}

function buildVariableDoc(filePath, name, node) {
  const lowerPath = filePath.toLowerCase();
  const init = node.init;
  const meta = buildMeta(filePath, node, name);
  const returnMeta = gatherReturnSignals(init || node);
  const description = (() => {
    if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
      return describeFunction(name, filePath, { ...meta, ...returnMeta }, node.params || []);
    }
    if (meta.isConstant) {
      return `${titleize(name)} constant.`;
    }
    if (init && init.type === 'ArrayExpression') {
      return `${titleize(name)} array.`;
    }
    if (init && init.type === 'ObjectExpression') {
      if (lowerPath.includes('/redux/reducers/') && name === 'initialState') {
        return `Initial Redux state for the ${path.basename(filePath, path.extname(filePath))} slice.`;
      }
      return `${titleize(name)} object.`;
    }
    if (init && init.type === 'StringLiteral') {
      return `${titleize(name)} string constant.`;
    }
    if (init && init.type === 'NumericLiteral') {
      return `${titleize(name)} numeric constant.`;
    }
    return `${titleize(name)} value.`;
  })();

  const returnType = init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')
    ? inferReturnType(init, { ...meta, ...returnMeta })
    : init && init.type === 'ArrayExpression'
      ? 'Array'
      : init && init.type === 'ObjectExpression'
        ? 'Object'
        : init && init.type === 'StringLiteral'
          ? 'string'
          : init && init.type === 'NumericLiteral'
            ? 'number'
            : init && init.type === 'BooleanLiteral'
              ? 'boolean'
              : '*';

  const lines = ['/**', ` * ${description}`];
  if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression') && init.async) {
    lines.push(' *');
    lines.push(' * @async');
  }
  if (init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression')) {
    for (const param of init.params || []) {
      if (param.type === 'ObjectPattern') {
        lines.push(' * @param {Object} props - Input object.');
        for (const prop of param.properties) {
          const propName = prop.key?.name || prop.key?.value;
          if (propName) lines.push(` * @param {*} props.${propName} - Nested property value.`);
        }
      } else if (param.type === 'Identifier') {
        lines.push(` * @param {${inferSimpleType(param)}} ${param.name} - Input value.`);
      } else if (param.type === 'AssignmentPattern' && param.left.type === 'Identifier') {
        lines.push(` * @param {${inferSimpleType(param)}} ${param.left.name} - Input value.`);
      } else if (param.type === 'RestElement' && param.argument.type === 'Identifier') {
        lines.push(` * @param {Array} ${param.argument.name} - Input values.`);
      }
    }
  }
  lines.push(` * @returns {${returnType}}`);
  lines.push(' */');
  return lines.join('\n');
}

function buildObjectMethodDoc(filePath, name, node) {
  const meta = buildMeta(filePath, node, name);
  const functionNode = {
    ...node,
    params: node.params || [],
    body: node.body,
    async: node.async,
  };
  return buildFunctionDoc('', filePath, name, functionNode, meta);
}

function isDocCandidate(pathNode, filePath) {
  const node = pathNode.node;
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
    return Boolean(node.id && node.id.name);
  }
  if (node.type === 'VariableDeclarator' && node.id.type === 'Identifier') {
    const isFunction = node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression');
    const isTopLevel = pathNode.parentPath && pathNode.parentPath.parentPath && pathNode.parentPath.parentPath.node.type === 'Program';
    return isFunction || isTopLevel;
  }
  if (node.type === 'ObjectMethod' || node.type === 'ObjectProperty') {
    const keyName = node.key && (node.key.name || node.key.value);
    const hasFunctionValue = node.type === 'ObjectMethod' || (node.value && (node.value.type === 'ArrowFunctionExpression' || node.value.type === 'FunctionExpression'));
    return Boolean(keyName && hasFunctionValue);
  }
  if (node.type === 'ExportDefaultDeclaration') {
    const decl = node.declaration;
    if (!decl) return false;
    if (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration') return false;
    if (decl.type === 'Identifier') return false;
    return true;
  }
  return false;
}

function getNameFromNode(pathNode, filePath) {
  const node = pathNode.node;
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
    return node.id?.name || '';
  }
  if (node.type === 'VariableDeclarator') {
    return node.id.type === 'Identifier' ? node.id.name : '';
  }
  if (node.type === 'ObjectMethod' || node.type === 'ObjectProperty') {
    return node.key && (node.key.name || node.key.value) ? String(node.key.name || node.key.value) : '';
  }
  if (node.type === 'ExportDefaultDeclaration') {
    return path.basename(filePath, path.extname(filePath));
  }
  return '';
}

function getInsertPosition(pathNode) {
  const node = pathNode.node;
  if (node.type === 'ExportDefaultDeclaration') return node.start;
  if (node.type === 'VariableDeclarator') return pathNode.parentPath.node.start;
  return node.start;
}

function maybeBuildDoc(pathNode, filePath, source, comments) {
  const node = pathNode.node;
  const name = getNameFromNode(pathNode, filePath);
  if (!name) return null;
  const insertAt = getInsertPosition(pathNode);
  if (hasLeadingJsdoc(source, comments, insertAt)) return null;
  const indent = getCommentIndent(source, insertAt);
  if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
    return indent + buildFunctionDoc(source, filePath, name, node, buildMeta(filePath, node, name));
  }
  if (node.type === 'VariableDeclarator') {
    return indent + buildVariableDoc(filePath, name, node);
  }
  if (node.type === 'ObjectMethod') {
    return indent + buildObjectMethodDoc(filePath, name, node);
  }
  if (node.type === 'ObjectProperty') {
    const value = node.value;
    if (!value || (value.type !== 'ArrowFunctionExpression' && value.type !== 'FunctionExpression')) return null;
    const fakeVarNode = { init: value, params: value.params, async: value.async };
    return indent + buildVariableDoc(filePath, name, fakeVarNode);
  }
  if (node.type === 'ExportDefaultDeclaration') {
    const base = path.basename(filePath, path.extname(filePath));
    const description = `${titleize(base)} default export.`;
    return `${indent}/**\n${indent} * ${description}\n${indent} *\n${indent} * @returns {*}\n${indent} */`;
  }
  return null;
}

function ensureFileDoc(source, filePath, comments, exportedNames) {
  const trimmed = source.trimStart();
  if (/^\/\*\*/.test(trimmed)) return null;
  const firstCodeIndex = source.search(/\S/);
  const indent = '';
  const fileDoc = `/**\n * ${describeFile(filePath, exportedNames)}\n */\n\n`;
  return source.slice(0, firstCodeIndex >= 0 ? firstCodeIndex : 0) + fileDoc + source.slice(firstCodeIndex >= 0 ? firstCodeIndex : 0);
}

function processFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parseSource(source, filePath);
  } catch (error) {
    console.warn(`[jsdoc] Skipping parse error in ${filePath}: ${error.message}`);
    return false;
  }

  const comments = ast.comments || [];
  const insertions = [];
  const exportedNames = new Set();

  traverse(ast, {
    FunctionDeclaration(pathNode) {
      if (pathNode.parentPath && pathNode.parentPath.node.type !== 'Program' && pathNode.parentPath.node.type !== 'BlockStatement') return;
      const doc = maybeBuildDoc(pathNode, filePath, source, comments);
      if (doc) insertions.push({ start: pathNode.node.start, text: doc + '\n' });
      if (pathNode.node.id?.name) exportedNames.add(pathNode.node.id.name);
    },
    ClassDeclaration(pathNode) {
      if (pathNode.parentPath && pathNode.parentPath.node.type !== 'Program' && pathNode.parentPath.node.type !== 'BlockStatement') return;
      const doc = maybeBuildDoc(pathNode, filePath, source, comments);
      if (doc) insertions.push({ start: pathNode.node.start, text: doc + '\n' });
      if (pathNode.node.id?.name) exportedNames.add(pathNode.node.id.name);
    },
    VariableDeclarator(pathNode) {
      const parent = pathNode.parentPath?.parentPath?.node;
      const isTopLevel = parent && parent.type === 'Program';
      const init = pathNode.node.init;
      const isFunction = init && (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression');
      const isExported = pathNode.parentPath?.parentPath?.node.type === 'ExportNamedDeclaration';
      const docEligible = isFunction || isTopLevel || isExported;
      if (!docEligible) return;
      const doc = maybeBuildDoc(pathNode, filePath, source, comments);
      if (doc) insertions.push({ start: isExported ? pathNode.parentPath.parentPath.node.start : pathNode.parentPath.node.start, text: doc + '\n' });
      if (pathNode.node.id.type === 'Identifier') exportedNames.add(pathNode.node.id.name);
    },
    ObjectMethod(pathNode) {
      const doc = maybeBuildDoc(pathNode, filePath, source, comments);
      if (doc) insertions.push({ start: pathNode.node.start, text: doc + '\n' });
    },
    ObjectProperty(pathNode) {
      const doc = maybeBuildDoc(pathNode, filePath, source, comments);
      if (doc) insertions.push({ start: pathNode.node.start, text: doc + '\n' });
    },
    ExportDefaultDeclaration(pathNode) {
      const doc = maybeBuildDoc(pathNode, filePath, source, comments);
      if (doc) insertions.push({ start: pathNode.node.start, text: doc + '\n' });
    },
    ExportNamedDeclaration(pathNode) {
      const decl = pathNode.node.declaration;
      if (decl && decl.type === 'VariableDeclaration') {
        for (const d of decl.declarations) {
          if (d.id.type === 'Identifier') exportedNames.add(d.id.name);
        }
      }
      if (decl && (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration')) {
        if (decl.id?.name) exportedNames.add(decl.id.name);
      }
    },
  });

  if (insertions.length === 0) {
    const fileDoc = ensureFileDoc(source, filePath, comments, Array.from(exportedNames));
    if (!fileDoc) return false;
    fs.writeFileSync(filePath, fileDoc, 'utf8');
    return true;
  }

  let updated = source;
  insertions
    .sort((a, b) => b.start - a.start)
    .forEach(({ start, text }) => {
      updated = updated.slice(0, start) + text + updated.slice(start);
    });

  const fileDoc = ensureFileDoc(updated, filePath, comments, Array.from(exportedNames));
  if (fileDoc && fileDoc !== updated) {
    updated = fileDoc;
  }

  if (updated !== source) {
    fs.writeFileSync(filePath, updated, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const files = collectFiles();
  let changed = 0;
  for (const filePath of files) {
    try {
      if (processFile(filePath)) changed++;
    } catch (error) {
      console.warn(`[jsdoc] Failed for ${filePath}: ${error.message}`);
    }
  }
  console.log(`JSDoc pass complete. Updated ${changed} files.`);
}

main();
