// Quick test to debug card generation
const { generateRandomCard90 } = require('./src/lib/bingo/generator-cards.ts');

console.log('Generating a 90-ball card...');
const card = generateRandomCard90();

if (card) {
  console.log('\nCode:', card.code);
  console.log('\nNumbers by group:');
  card.numbers.forEach((group, i) => {
    console.log(`Group ${i} (${i*10+1}-${i*10+10}):`, group);
  });
  
  console.log('\nGrid:');
  card.grid.forEach((row, i) => {
    const rowNumbers = row.filter(n => n !== null);
    console.log(`Row ${i}:`, row, `(${rowNumbers.length} numbers)`);
  });
  
  // Count numbers per row
  const rowCounts = card.grid.map(row => row.filter(n => n !== null).length);
  console.log('\nNumbers per row:', rowCounts);
  console.log('Total numbers:', rowCounts.reduce((a, b) => a + b, 0));
} else {
  console.log('Failed to generate card!');
}
