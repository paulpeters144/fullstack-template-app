import { program } from 'commander';
import { execSync } from 'child_process';
import { deleteDirectory, esBuildProject } from './util';

program
  .version('0.0.1')
  .description('Command line tool for building the api')
  .option('-s, --STAGE <value>', 'Specify the application stage')
  .parse(process.argv);

const stage = program.opts().STAGE;
if (!stage) {
  console.error('STAGE not specified');
  process.exit(1);
}
console.log('APP STAGE:', stage);

async function main() {
  try {
    deleteDirectory('./preDist');
    deleteDirectory('./dist');

    console.log('Transpiling project');
    execSync('npx tsc -p tsconfig.json');

    console.log('Building project');
    const file = stage === 'local' ? 'app' : 'lambda';
    await esBuildProject(file, stage);

    deleteDirectory('./preDist');
    console.log('done!');
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
