/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const { build } = require('esbuild');
const { execSync } = require('child_process');
const fs = require('fs');
var zipper = require('zip-local');

/**
 *
 * @param {string} fileLocation
 * @returns {void}
 */
function uploadToAwsLambda(fileLocation) {
  const cmd = `aws lambda update-function-code --function-name da-api-lambda-test --zip-file fileb://${fileLocation}`;
  execSync(cmd);
}

function zipDir(dir, outputZipPath) {
  zipper.sync.zip(dir).compress().save(outputZipPath);
}

/**
 *
 * @param {string} dirPath
 * @returns {void}
 */
function deleteDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory does not exist: ${dirPath}`);
    return;
  }

  const stats = fs.statSync(dirPath);
  if (!stats.isDirectory()) {
    console.log(`Path is not a directory: ${dirPath}`);
    return;
  }

  try {
    fs.rmSync(dirPath, { recursive: true });
    console.log(`Deleted directory: ${dirPath}`);
  } catch (err) {
    console.error(`Error deleting directory: ${dirPath}`, err);
  }
}

/**
 *
 * @param {string} file
 * @param {string} stage
 * @returns {Promise}
 */
function esBuildProject(file, stage) {
  return build({
    entryPoints: ['./preDist/back/src/' + file],
    bundle: true,
    minify: true,
    platform: 'node',
    sourcemap: true,
    target: 'node20.11',
    outdir: 'dist',
    define: {
      'process.env.STAGE': `"${stage}"`,
    },
  })
    .catch(() => {
      console.log('error occured during esbuild');
      process.exit(1);
    })
    .finally(() => console.log('ESBUILD FINISHED'));
}

module.exports = {
  deleteDirectory,
  esBuildProject,
  zipDir,
  uploadToAwsLambda,
};
