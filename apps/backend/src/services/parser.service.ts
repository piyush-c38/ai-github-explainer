import Parser from 'tree-sitter';
import JavaScript from 'tree-sitter-javascript';
import Python from 'tree-sitter-python';
import fs from 'fs';
import path from 'path';
import * as babelParser from '@babel/parser';
import traverse from '@babel/traverse';

interface ParsedData {
  filePath: string;
  dependencies: string[];
}

class ParserService {
  private parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  private getLanguage(filePath: string): any {
    const extension = path.extname(filePath);
    switch (extension) {
      case '.js':
      case '.jsx':
      case '.ts':
      case '.tsx':
        return JavaScript;
      case '.py':
        return Python;
      default:
        return null;
    }
  }

  private parseWithTreeSitter(filePath: string, language: any): Parser.Tree {
    this.parser.setLanguage(language);
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    return this.parser.parse(sourceCode);
  }

  private extractDependenciesBabel(filePath: string): string[] {
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    const dependencies: string[] = [];
    const ast = babelParser.parse(sourceCode, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
    });

    traverse(ast, {
      ImportDeclaration({ node }) {
        dependencies.push(node.source.value);
      },
      CallExpression({ node }) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'require' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          dependencies.push(node.arguments[0].value);
        }
      },
    });

    return dependencies;
  }

  async parseFile(filePath: string): Promise<ParsedData | null> {
    const language = this.getLanguage(filePath);
    if (!language) {
      return null;
    }

    let dependencies: string[] = [];
    if (language === JavaScript) {
      dependencies = this.extractDependenciesBabel(filePath);
    } else {
      const tree = this.parseWithTreeSitter(filePath, language);
      // Basic dependency extraction for other languages can be added here
    }

    return {
      filePath,
      dependencies,
    };
  }
}

export const parserService = new ParserService();
