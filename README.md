# Vulnerable Demo Application

⚠️ **WARNING: This application contains intentional security vulnerabilities for educational and testing purposes. DO NOT deploy this in production!**

## Purpose

This application demonstrates both:
1. **Dependency vulnerabilities** - Fixed by upgrading packages (Snyk SCA)
2. **Code vulnerabilities** - Fixed by changing the code (Snyk Code/SAST)

## Vulnerable Dependencies

| Package | Vulnerable Version | Known Vulnerabilities | Fixed Version |
|---------|-------------------|----------------------|---------------|
| `lodash` | 4.17.15 | Prototype Pollution (CVE-2020-8203, CVE-2021-23337) | 4.17.21+ |
| `mongoose` | 5.7.5 | Prototype Pollution (CVE-2022-2564) | 5.13.15+ |
| `express` | 4.17.1 | Open Redirect (CVE-2024-29041), ReDoS | 4.19.2+ |
| `jsonwebtoken` | 8.5.0 | Improper Authentication (CVE-2022-23540) | 9.0.0+ |
| `serialize-javascript` | 2.1.0 | XSS, Arbitrary Code Injection (CVE-2020-7660) | 3.1.0+ |
| `minimist` | 1.2.0 | Prototype Pollution (CVE-2021-44906) | 1.2.6+ |
| `node-fetch` | 2.6.0 | Information Exposure (CVE-2022-0235) | 2.6.7+ |
| `ejs` | 2.7.4 | Remote Code Execution (CVE-2022-29078) | 3.1.7+ |
| `marked` | 0.7.0 | Regular Expression DoS (CVE-2022-21680) | 4.0.10+ |
| `js-yaml` | 3.13.1 | Arbitrary Code Execution | 3.14.1+ |
| `axios` | 0.21.0 | SSRF (CVE-2021-3749) | 0.21.2+ |
| `moment` | 2.29.1 | ReDoS (CVE-2022-24785) | 2.29.4+ |
| `underscore` | 1.12.0 | Arbitrary Code Execution (CVE-2021-23358) | 1.13.1+ |
| `handlebars` | 4.7.6 | Prototype Pollution (CVE-2021-23369) | 4.7.7+ |
| `ini` | 1.3.5 | Prototype Pollution (CVE-2020-7788) | 1.3.6+ |
| `y18n` | 4.0.0 | Prototype Pollution (CVE-2020-7774) | 4.0.1+ |
| `glob-parent` | 5.1.0 | ReDoS (CVE-2020-28469) | 5.1.2+ |
| `path-parse` | 1.0.6 | ReDoS (CVE-2021-23343) | 1.0.7+ |
| `trim-newlines` | 3.0.0 | ReDoS (CVE-2021-33623) | 3.0.1+ |
| `tar` | 4.4.13 | Arbitrary File Overwrite (CVE-2021-32803) | 4.4.15+ |

## Running Snyk Scans

### Install Dependencies

```bash
npm install
```

### Run Snyk Open Source Scan (SCA)

```bash
snyk test
```

### Fix Vulnerabilities with Snyk

```bash
snyk fix
```

Or manually upgrade packages:

```bash
npm update
```

## How to Fix

All vulnerabilities in this app can be fixed by upgrading to newer versions of the packages. Run:

```bash
npm audit fix
```

Or for more aggressive fixes:

```bash
npm audit fix --force
```

## Code Vulnerabilities (SAST)

These require code changes to fix:

| Vulnerability | Location | Description |
|--------------|----------|-------------|
| Hardcoded Secret | `server.js:26` | JWT secret hardcoded in source |
| Command Injection | `server.js:59` | User input passed to `exec()` |
| Path Traversal | `server.js:66` | Unsanitized file path |
| XSS | `server.js:74` | Reflected user input in HTML |
| Open Redirect | `server.js:143` | Unvalidated redirect URL |

## Disclaimer

This code is provided for educational purposes only. The vulnerabilities are intentional and should help developers understand how security scanning tools like Snyk detect and remediate both dependency and code vulnerabilities.
