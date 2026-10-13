import { createServer } from 'vite';

async function main() {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  try {
    const { validateReferences } = await server.ssrLoadModule('./src/utils/referenceValidator.ts');
    
    console.log('====================================================');
    console.log('   CodeNerve Phase 1: Reference Integrity Check     ');
    console.log('====================================================');

    const result = validateReferences();

    console.log('\n--- Metrics ---');
    console.log(`Canonical Problems:        ${result.metrics.totalProblems}`);
    console.log(`Registered Visualizers:    ${result.metrics.totalVisualizers}`);
    console.log(`Curriculum Lessons:        ${result.metrics.totalLessons}`);
    console.log(`Syllabus Topics:           ${result.metrics.totalSyllabusTopics}`);
    console.log(`Interactive Graph Nodes:   ${result.metrics.totalGraphNodes}`);

    if (result.warnings.length > 0) {
      console.log(`\n--- Warnings (${result.warnings.length}) ---`);
      for (const warn of result.warnings) {
        console.warn(`[WARN] ${warn}`);
      }
    }

    if (result.errors.length > 0) {
      console.log(`\n--- Errors (${result.errors.length}) ---`);
      for (const err of result.errors) {
        console.error(`[ERROR] ${err}`);
      }
      console.log('\nResult: FAILED');
      process.exitCode = 1;
    } else {
      console.log('\n--- Result ---');
      console.log('PASSED: All problem references, visualizers, and links are valid!');
      process.exitCode = 0;
    }
  } finally {
    await server.close();
  }
}

main().catch((err) => {
  console.error('Validation runner error:', err);
  process.exit(1);
});
