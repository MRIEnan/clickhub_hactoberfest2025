#!/usr/bin/env node

/**
 * 🔍 Validation Script for Button Contributions
 * --------------------------------------------
 * Ensures each contributor's folder follows the required structure:
 * - Must contain index.js exporting button metadata
 * - Must contain a button implementation (React or HTML)
 * - Optional: button.css, button.js, README.md
 */

const fs = require('fs');
const path = require('path');

// === CONFIGURATION ===
const CONTRIBUTIONS_DIR = path.join(__dirname, '../contributions');
const REQUIRED_FILES = ['index.js'];
const OPTIONAL_FILES = ['button.jsx', 'button.tsx', 'button.html', 'button.css', 'button.js', 'README.md'];
const MAX_FILE_SIZE = 50 * 1024; // 50KB limit

// === COLORS FOR TERMINAL OUTPUT ===
const color = {
  red: (t) => `\x1b[31m${t}\x1b[0m`,
  yellow: (t) => `\x1b[33m${t}\x1b[0m`,
  green: (t) => `\x1b[32m${t}\x1b[0m`,
  cyan: (t) => `\x1b[36m${t}\x1b[0m`,
};

/**
 * Validate a single contributor directory
 */
function validateContribution(contributorDir) {
  const contributorPath = path.join(CONTRIBUTIONS_DIR, contributorDir);
  const errors = [];
  const warnings = [];

  const isDir = fs.lstatSync(contributorPath).isDirectory();
  if (!isDir) return { errors: [`${contributorDir} is not a directory`], warnings };

  // --- Check required files ---
  for (const file of REQUIRED_FILES) {
    const filePath = path.join(contributorPath, file);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required file: ${file}`);
      continue;
    }

    if (file === 'index.js') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (!/export\s+default|module\.exports/.test(content)) {
          errors.push('index.js must export button metadata');
        }
        if (!/name|author|type/.test(content)) {
          warnings.push('index.js should include "name", "author", and "type" fields');
        }
      } catch (err) {
        errors.push(`Error reading index.js: ${err.message}`);
      }
    }
  }

  // --- Check implementation presence ---
  const files = new Set(fs.readdirSync(contributorPath));
  const hasReact = files.has('button.jsx') || files.has('button.tsx');
  const hasHtml = files.has('button.html');

  if (!hasReact && !hasHtml) {
    errors.push('Missing button implementation (button.jsx, button.tsx, or button.html)');
  }

  // --- HTML buttons should have CSS ---
  if (hasHtml && !files.has('button.css')) {
    warnings.push('HTML button should include button.css for styling');
  }

  // --- Check file sizes ---
  for (const file of files) {
    const filePath = path.join(contributorPath, file);
    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
      warnings.push(`File ${file} exceeds 50KB (${Math.round(stats.size / 1024)}KB)`);
    }
  }

  return { errors, warnings };
}

/**
 * Main validation runner
 */
function main() {
  console.log(color.cyan('🔍 Validating button contributions...\n'));

  if (!fs.existsSync(CONTRIBUTIONS_DIR)) {
    console.error(color.red('❌ Contributions directory not found.'));
    process.exit(1);
  }

  const contributors = fs
    .readdirSync(CONTRIBUTIONS_DIR)
    .filter((item) => {
      const itemPath = path.join(CONTRIBUTIONS_DIR, item);
      return fs.lstatSync(itemPath).isDirectory() && !item.startsWith('.');
    });

  if (contributors.length === 0) {
    console.log(color.yellow('📝 No contributions found yet. Ready for the first one!'));
    return;
  }

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const contributor of contributors) {
    const { errors, warnings } = validateContribution(contributor);

    if (errors.length === 0 && warnings.length === 0) {
      console.log(color.green(`✅ ${contributor} - All good!`));
    } else {
      console.log(`\n📁 ${color.cyan(contributor)}:`);
      for (const err of errors) {
        console.log(`  ❌ ${color.red(err)}`);
        totalErrors++;
      }
      for (const warn of warnings) {
        console.log(`  ⚠️  ${color.yellow(warn)}`);
        totalWarnings++;
      }
    }
  }

  // --- Summary ---
  console.log('\n📊 ' + color.cyan('Summary:'));
  console.log(`   Contributors: ${contributors.length}`);
  console.log(`   Errors: ${color.red(totalErrors)}`);
  console.log(`   Warnings: ${color.yellow(totalWarnings)}`);

  if (totalErrors > 0) {
    console.log('\n❌ ' + color.red('Validation failed. Please fix the errors above.'));
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  ' + color.yellow('Validation passed with warnings. Consider addressing them.'));
  } else {
    console.log('\n🎉 ' + color.green('All contributions are valid!'));
  }
}

if (require.main === module) main();
module.exports = { validateContribution };
