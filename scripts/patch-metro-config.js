const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'node_modules', 'metro-config', 'src', 'loadConfig.js');

if (!fs.existsSync(filePath)) {
  process.exit(0);
}

const original = fs.readFileSync(filePath, 'utf8');
const target = "  const reversedConfigs = configs.toReversed();\n";
const replacement = "  const reversedConfigs = typeof configs.toReversed === \"function\"\n    ? configs.toReversed()\n    : [...configs].reverse();\n";

if (!original.includes(target)) {
  process.exit(0);
}

const updated = original.replace(target, replacement).replace(
  "      return mergeConfigAsync(nextConfig, reversedConfigs.toReversed());\n",
  "      return mergeConfigAsync(\n        nextConfig,\n        typeof reversedConfigs.toReversed === \"function\"\n          ? reversedConfigs.toReversed()\n          : [...reversedConfigs].reverse(),\n      );\n",
);

if (updated !== original) {
  fs.writeFileSync(filePath, updated);
}