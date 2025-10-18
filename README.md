# L-KERN v4 - Clean Slate ERP System

**Commercial Name**: BOSS (Business Operating System Service)
**Version**: 4.0.0
**Created**: 2025-10-13
**Developer**: BOSSystems s.r.o.

---

## 🎯 Project Overview

L-KERN v4 je nový čistý začiatok ERP systému s lessons learned z v3 projektu.

---

## 🚀 Getting Started

### Quick Start (Docker - Recommended)

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f lkms201-web-ui

# Access application
# http://localhost:4201
```

### Local Development (Without Docker)

```bash
yarn install
yarn nx dev web-ui
```

**Full Setup Guide**: [docs/getting-started.md](./docs/getting-started.md)

---

## 📚 Documentation

- **[Getting Started](./docs/getting-started.md)** - Setup and run with Docker
- **[Testing Guide](./docs/testing.md)** - How to run tests (Vitest + pytest)
- **[Troubleshooting](./docs/troubleshooting.md)** - Known issues and solutions
- **[Project Overview](./docs/PROJECT-OVERVIEW.md)** - Architecture and project status
- **[Coding Standards](./docs/programming/coding-standards.md)** - Code conventions
- **[Code Examples](./docs/programming/code-examples.md)** - Practical patterns

**Documentation Index**: [docs/README.md](./docs/README.md)
