const LUObfuscator = require('./index');
const fs = require('fs');

// 테스트 1: 기본 난독화
console.log('=== 테스트 1: 기본 난독화 ===\n');

const testCode = `
function hello(name) {
  const message = "Hello, " + name;
  return message;
}
`;

const obfuscator = new LUObfuscator({
  mangleVars: true,
  mangleFunctions: true,
  compact: false
});

const obfuscatedCode = obfuscator.obfuscate(testCode);
console.log('원본 코드:');
console.log(testCode);
console.log('\n난독화된 코드:');
console.log(obfuscatedCode);

// 테스트 2: 압축 옵션
console.log('\n\n=== 테스트 2: 압축 난독화 ===\n');

const obfuscator2 = new LUObfuscator({
  mangleVars: true,
  mangleFunctions: true,
  compact: true
});

const obfuscatedCode2 = obfuscator2.obfuscate(testCode);
console.log('압축 난독화 결과:');
console.log(obfuscatedCode2);

// 테스트 3: example.js 파일 난독화
console.log('\n\n=== 테스트 3: example.js 난독화 ===\n');

if (fs.existsSync('./example.js')) {
  const exampleCode = fs.readFileSync('./example.js', 'utf8');
  const obfuscator3 = new LUObfuscator({
    mangleVars: true,
    mangleFunctions: true,
    compact: true
  });
  
  const obfuscatedExample = obfuscator3.obfuscate(exampleCode);
  
  console.log('원본 크기:', exampleCode.length, 'bytes');
  console.log('난독화된 크기:', obfuscatedExample.length, 'bytes');
  console.log('감소율:', ((1 - obfuscatedExample.length / exampleCode.length) * 100).toFixed(2) + '%');
  
  // 결과 저장
  fs.writeFileSync('./example.obfuscated.js', obfuscatedExample);
  console.log('\n✅ 난독화된 코드가 example.obfuscated.js로 저장되었습니다!');
}

console.log('\n=== 모든 테스트 완료! ===');
