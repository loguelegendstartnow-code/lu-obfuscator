#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const LUObfuscator = require('./index');

program
  .name('lu-obfuscator')
  .description('A powerful code obfuscator')
  .version('1.0.0')
  .argument('<input>', 'Input file path')
  .option('-o, --output <output>', 'Output file path', 'obfuscated.js')
  .option('-c, --compact', 'Compact the code')
  .option('-e, --encrypt-strings', 'Encrypt string literals')
  .option('-v, --mangle-vars', 'Mangle variable names', true)
  .option('-f, --mangle-functions', 'Mangle function names', true)
  .parse(process.argv);

const [inputFile] = program.args;
const options = program.opts();

try {
  // Read input file
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file "${inputFile}" not found`);
    process.exit(1);
  }

  const code = fs.readFileSync(inputFile, 'utf8');
  console.log(`📖 Reading: ${inputFile}`);

  // Create obfuscator instance
  const obfuscator = new LUObfuscator({
    mangleVars: options.mangleVars,
    mangleFunctions: options.mangleFunctions,
    encryptStrings: options.encryptStrings,
    compact: options.compact
  });

  // Obfuscate code
  console.log('🔄 Obfuscating...');
  const obfuscatedCode = obfuscator.obfuscate(code);

  // Write output file
  const outputPath = path.resolve(options.output);
  fs.writeFileSync(outputPath, obfuscatedCode, 'utf8');
  console.log(`✅ Success! Output: ${outputPath}`);

  // Show statistics
  const originalSize = code.length;
  const obfuscatedSize = obfuscatedCode.length;
  const reduction = ((1 - obfuscatedSize / originalSize) * 100).toFixed(2);

  console.log('\n📊 Statistics:');
  console.log(`  Original size: ${originalSize} bytes`);
  console.log(`  Obfuscated size: ${obfuscatedSize} bytes`);
  console.log(`  Size reduction: ${reduction}%`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
