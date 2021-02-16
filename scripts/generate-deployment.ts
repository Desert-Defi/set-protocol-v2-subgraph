// Generates deployment related files for given network
// Specify networks in ../deployments.json
// Usage: yarn run ts-node scripts/generate-deployment.ts <NETWORK_NAME>

import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import deployments from '../deployments.json';

const deploymentName = process.argv[2];
if (!deploymentName) throw new Error('no deployment name provided');

// eslint-disable-next-line
const deploymentData = (deployments as any)[deploymentName];
if (!deploymentData) throw new Error(`deployment ${deploymentName} not found`);

console.log(`Generating deployment files for ${deploymentName}...`);

const generatedDir = path.join(process.cwd(), 'generated');
const templatesDir = path.join(process.cwd(), 'templates');

function replace(templateFile: string, outputFile: string) {
  console.log(`Writing template ${templateFile} to ${outputFile}`);
  const template = fs.readFileSync(templateFile);
  const compile = handlebars.compile(template.toString());
  const replaced = compile(deploymentData);
  fs.writeFileSync(outputFile, replaced);
}

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir);
}

// deployment.ts
let input = path.join(templatesDir, 'deployment.ts');
let output = path.join(generatedDir, 'deployment.ts');
replace(input, output);

// subgraph.yaml
input = path.join(templatesDir, 'subgraph.yaml');
output = path.join(process.cwd(), 'subgraph.yaml');
replace(input, output);
