import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const pkgPath = join(process.cwd(), "package.json");
const versionPath = join(process.cwd(), "static", "app-version.json");

// 1. Read package.json
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
const oldVersion = pkg.version;

// 2. Increment patch version (1.0.41 -> 1.0.42)
const parts = oldVersion.split(".");
parts[2] = (parseInt(parts[2]) + 1).toString();
const newVersion = parts.join(".");

pkg.version = newVersion;

// 3. Write back to package.json
writeFileSync(pkgPath, JSON.stringify(pkg, null, "\t") + "\n");

// 4. Generate app-version.json
const appVersion = {
	version: newVersion,
	buildTime: new Date().toISOString()
};

writeFileSync(versionPath, JSON.stringify(appVersion, null, "\t") + "\n");

console.log(`Version bumped: ${oldVersion} -> ${newVersion}`);
