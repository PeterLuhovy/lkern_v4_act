# ================================================================
# L-KERN v4 - Documentation Map
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\README.md
# Version: 2.0.0
# Created: 2025-10-13
# Updated: 2025-10-18
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Central documentation map for L-KERN v4 project.
#   This file is the SINGLE ENTRY POINT to all documentation.
#   Lists all documentation sections and their locations.
# ================================================================

---

## 📋 About This File

This is the **central documentation map** for L-KERN v4 project. All documentation is organized into subdirectories by topic. Use this file to find what you need.

**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\`

**Quick Links:**
- Need to start project? → [setup/getting-started.md](#setup--configuration)
- Need to run tests? → [setup/testing.md](#setup--configuration)
- Have a problem? → [setup/troubleshooting.md](#setup--configuration)
- Need code standards? → [programming/coding-standards.md](#programming)
- Want project overview? → [project/overview.md](#project-information)

---

## 🗂️ Documentation Structure

### 📁 Project Information
**Location:** `docs/project/`

Contains high-level project information, goals, and roadmap.

| File | Description | Path |
|------|-------------|------|
| **Project Overview** | Project goals, status, architecture summary | [project/overview.md](project/overview.md) |
| **Roadmap** | Development phases, milestones, task list | [project/roadmap.md](project/roadmap.md) |

---

### 📁 Setup & Configuration
**Location:** `docs/setup/`

Everything you need to set up and run the project.

| File | Description | Path |
|------|-------------|------|
| **Getting Started** | Docker setup, installation, running the project | [setup/getting-started.md](setup/getting-started.md) |
| **Testing Guide** | How to run tests (Vitest + pytest) in Docker and locally | [setup/testing.md](setup/testing.md) |
| **Troubleshooting** | Known issues and solutions (ADD NEW PROBLEMS HERE!) | [setup/troubleshooting.md](setup/troubleshooting.md) |

**⭐ Important:** When you solve a new problem, **add it to troubleshooting.md** so others can find the solution.

---

### 📁 Architecture
**Location:** `docs/architecture/`

System architecture, design decisions, infrastructure.

| File | Description | Path |
|------|-------------|------|
| **Port Mapping** | LKMS port mapping strategy (service ports) | [architecture/port-mapping.md](architecture/port-mapping.md) |
| **Main Architecture** | Overall system architecture (planned) | [architecture/main-architecture.md](architecture/main-architecture.md) |

---

### 📁 Programming
**Location:** `docs/programming/`

Coding standards, conventions, and practical examples.

| File | Description | Path |
|------|-------------|------|
| **Coding Standards** | Core rules (DRY, translations, theme, headers) | [programming/coding-standards.md](programming/coding-standards.md) |
| **Frontend Standards** | React 19, TypeScript 5.7, Vite 6, CSS patterns | [programming/frontend-standards.md](programming/frontend-standards.md) |
| **Backend Standards** | Python 3.11, FastAPI, gRPC, Kafka, SQLAlchemy | [programming/backend-standards.md](programming/backend-standards.md) |
| **Testing Guide** | pytest + Vitest testing checklists | [programming/testing-guide.md](programming/testing-guide.md) |
| **Docker Standards** | Docker & DevOps best practices | [programming/docker-standards.md](programming/docker-standards.md) |
| **Code Examples** | Practical examples (React, API, gRPC, DB, Testing) | [programming/code-examples.md](programming/code-examples.md) |
| **Toast Usage** | Toast notification system guide (useToast hook) | [programming/toast-usage.md](programming/toast-usage.md) |

**⭐ Important:** All code must follow [coding-standards.md](programming/coding-standards.md). For detailed patterns, see frontend/backend/testing/docker standards!

---

### 📁 Design
**Location:** `docs/design/`

Visual design system, UI component standards, and design tokens.

| File | Description | Path |
|------|-------------|------|
| **Component Design System** | Modern gradient-based design language for UI components | [design/component-design-system.md](design/component-design-system.md) |

**⭐ Important:** All UI components must follow the design system standards for visual consistency.

---

### 📁 Packages
**Location:** `docs/packages/`

Documentation for shared packages (@l-kern/*).

| Package | Description | Path |
|---------|-------------|------|
| **@l-kern/config** | Constants, translations, theme, design tokens | [packages/config.md](packages/config.md) |
| **@l-kern/ui-components** | Shared React components (Button, Input, etc.) | [packages/ui-components.md](packages/ui-components.md) |

---

### 📁 Temporary Files
**Location:** `docs/temp/`

Work-in-progress documentation, planning notes, TODO files.

**Contents:**
- Task planning documents
- Implementation drafts
- Development notes
- Temporary TODO lists

**⚠️ Note:** Files in `temp/` are not permanent and may be deleted after task completion.

---

## 🎯 Quick Reference

### Common Tasks

**I want to...**

| Task | Documentation |
|------|---------------|
| Start the project with Docker | [setup/getting-started.md](setup/getting-started.md) |
| Run tests | [setup/testing.md](setup/testing.md) |
| Fix a problem | [setup/troubleshooting.md](setup/troubleshooting.md) |
| Understand project architecture | [project/overview.md](project/overview.md) |
| See development roadmap | [project/roadmap.md](project/roadmap.md) |
| Learn coding standards | [programming/coding-standards.md](programming/coding-standards.md) |
| See code examples | [programming/code-examples.md](programming/code-examples.md) |
| Understand design system | [design/component-design-system.md](design/component-design-system.md) |
| Use @l-kern/config package | [packages/config.md](packages/config.md) |
| Use UI components | [packages/ui-components.md](packages/ui-components.md) |
| Check service ports | [architecture/port-mapping.md](architecture/port-mapping.md) |

---

## 📝 Documentation Requirements

### File Header Standard

**Every documentation file MUST have this header:**

```markdown
# ================================================================
# <Document Title>
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\<path>\<filename>.md
# Version: X.Y.Z
# Created: YYYY-MM-DD
# Updated: YYYY-MM-DD
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Brief description of what this document contains.
# ================================================================
```

### Documentation Principles

1. **✅ Single entry point** - This README.md is the only file in `docs/` root
2. **✅ Clear organization** - All other files in subdirectories by topic
3. **✅ Full file paths** - Every file header contains absolute path
4. **✅ Cross-references** - Link related documents together
5. **✅ Keep updated** - Update documentation when code changes
6. **✅ English language** - All documentation in English
7. **✅ Clear structure** - Use headers, tables, code blocks consistently

### Where to Add New Documentation

| Type of Documentation | Location |
|----------------------|----------|
| Project roadmap updates | `project/roadmap.md` |
| Setup/installation changes | `setup/getting-started.md` |
| New problem solved | `setup/troubleshooting.md` |
| New coding standard | `programming/coding-standards.md` |
| New code example | `programming/code-examples.md` |
| New package documentation | `packages/<package-name>.md` |
| Architecture decisions | `architecture/<topic>.md` |
| Temporary planning | `temp/<task-name>.md` |

---

## 🔍 Finding Information

### By Topic

- **Docker** → [setup/getting-started.md](setup/getting-started.md)
- **Testing** → [setup/testing.md](setup/testing.md)
- **Problems** → [setup/troubleshooting.md](setup/troubleshooting.md)
- **Code Style** → [programming/coding-standards.md](programming/coding-standards.md)
- **Examples** → [programming/code-examples.md](programming/code-examples.md)
- **Roadmap** → [project/roadmap.md](project/roadmap.md)
- **Ports** → [architecture/port-mapping.md](architecture/port-mapping.md)

### By Package

- **@l-kern/config** → [packages/config.md](packages/config.md)
- **@l-kern/ui-components** → [packages/ui-components.md](packages/ui-components.md)

### By Problem Type

- **Docker issues** → [setup/troubleshooting.md#docker-issues](setup/troubleshooting.md#docker-issues)
- **Test failures** → [setup/troubleshooting.md#testing-issues](setup/troubleshooting.md#testing-issues)
- **Build errors** → [setup/troubleshooting.md#build--compilation](setup/troubleshooting.md#build--compilation)
- **Network problems** → [setup/troubleshooting.md#network--api](setup/troubleshooting.md#network--api)

---

## 📖 Documentation Tree (Full Hierarchy)

```
L:\system\lkern_codebase_v4_act\docs\
│
├── README.md                              # ⭐ THIS FILE - Documentation map
│
├── project/                               # Project information
│   ├── overview.md                        # Project goals, status, architecture
│   └── roadmap.md                         # Development phases and milestones
│
├── setup/                                 # Setup and configuration
│   ├── getting-started.md                 # Docker setup and installation
│   ├── testing.md                         # Testing guide (Vitest + pytest)
│   └── troubleshooting.md                 # Known issues and solutions ⭐
│
├── architecture/                          # System architecture
│   ├── port-mapping.md                    # Port mapping strategy
│   └── main-architecture.md               # Overall architecture (planned)
│
├── programming/                           # Programming guidelines
│   ├── coding-standards.md                # Code conventions ⭐ MUST READ
│   └── code-examples.md                   # Practical code examples
│
├── packages/                              # Package documentation
│   ├── config.md                          # @l-kern/config
│   └── ui-components.md                   # @l-kern/ui-components
│
└── temp/                                  # Temporary files
    ├── task-0.2-ui-components-plan.md     # UI components planning
    ├── task-0.2-progress.md               # Task progress tracker
    └── *.md                               # Other temporary docs
```

---

## 🆘 Need Help?

**Can't find what you need?**

1. **Check this README.md** - All documentation is mapped here
2. **Use Ctrl+F** in your browser to search this page
3. **Check [setup/troubleshooting.md](setup/troubleshooting.md)** - Common problems
4. **Ask on team chat** - Someone may have encountered it before

**Found outdated documentation?**

- Update the relevant file
- Update version number in file header
- Update "Updated" date in file header

---

**Last Updated:** 2025-10-18
**Maintainer:** BOSSystems s.r.o.
**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\`
