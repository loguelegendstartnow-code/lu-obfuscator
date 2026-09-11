const crypto = require('crypto');

class LUObfuscator {
  constructor(options = {}) {
    this.options = {
      mangleVars: options.mangleVars !== false,
      mangleFunctions: options.mangleFunctions !== false,
      encryptStrings: options.encryptStrings || false,
      compact: options.compact || false,
      ...options
    };
    this.varMap = {};
    this.funcMap = {};
  }

  /**
   * Main obfuscate method
   */
  obfuscate(code) {
    let result = code;

    if (this.options.mangleVars) {
      result = this.mangleVariables(result);
    }

    if (this.options.mangleFunctions) {
      result = this.mangleFunctions(result);
    }

    if (this.options.encryptStrings) {
      result = this.encryptStrings(result);
    }

    if (this.options.compact) {
      result = this.compact(result);
    }

    return result;
  }

  /**
   * Mangle variable names
   */
  mangleVariables(code) {
    const varRegex = /\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    
    return code.replace(varRegex, (match, keyword, varName) => {
      if (!this.varMap[varName]) {
        this.varMap[varName] = `_${this.generateHash(varName).substring(0, 8)}`;
      }
      return `${keyword} ${this.varMap[varName]}`;
    });
  }

  /**
   * Mangle function names
   */
  mangleFunctions(code) {
    const funcRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
    
    return code.replace(funcRegex, (match, funcName) => {
      if (!this.funcMap[funcName]) {
        this.funcMap[funcName] = `_${this.generateHash(funcName).substring(0, 8)}`;
      }
      return `function ${this.funcMap[funcName]}(`;
    });
  }

  /**
   * Encrypt string literals
   */
  encryptStrings(code) {
    const stringRegex = /(['"`])([^'"`\\]|\\.)*?\1/g;
    
    return code.replace(stringRegex, (match) => {
      const encryptedString = this.encryptString(match);
      return `decrypt("${encryptedString}")`;
    });
  }

  /**
   * Compact code (remove comments and extra whitespace)
   */
  compact(code) {
    // Remove single-line comments
    code = code.replace(/\/\/.*$/gm, '');
    
    // Remove multi-line comments
    code = code.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove extra whitespace
    code = code.replace(/\s+/g, ' ');
    
    // Remove spaces around operators
    code = code.replace(/\s*([{}();,=+\-*\/])\s*/g, '$1');
    
    return code.trim();
  }

  /**
   * Helper: Generate hash for identifier
   */
  generateHash(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  /**
   * Helper: Encrypt a string
   */
  encryptString(str) {
    const key = 'lu-obfuscator-key';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', crypto.scryptSync(key, 'salt', 32), iv);
    
    let encrypted = cipher.update(str, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  /**
   * Helper: Decrypt a string
   */
  static decryptString(encryptedStr) {
    const key = 'lu-obfuscator-key';
    const parts = encryptedStr.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', crypto.scryptSync(key, 'salt', 32), iv);
    
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}

module.exports = LUObfuscator;
