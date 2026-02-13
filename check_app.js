// 检查 localStorage 状态的简单脚本
console.log('=== Current localStorage State ===');
const selectedAge = localStorage.getItem('selectedAge');
console.log('selectedAge:', selectedAge);
console.log('childName:', localStorage.getItem('childName'));

if (!selectedAge) {
  console.log('\n⚠️ No selectedAge found - will redirect to age selection');
} else {
  console.log('\n✓ selectedAge exists - should show main app');
}
