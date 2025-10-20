# ================================================================
# L-KERN v4 - Documentation Map
# ================================================================
# File: L:\system\lkern_codebase_v4_act\docs\README.md
# Version: 3.0.0
# Created: 2025-10-13
# Updated: 2025-10-20
# Project: BOSS (Business Operating System Service)
# Developer: BOSSystems s.r.o.
#
# Description:
#   Central documentation map for L-KERN v4 project.
#   This file is the SINGLE ENTRY POINT to all documentation.
#   Lists all documentation sections and their locations.
#   Includes complete documentation for 19 components, 5 hooks, 5 utilities (29 total).
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
| **Documentation Standards** | ⭐ How to document components/hooks/utilities | [programming/documentation-standards.md](programming/documentation-standards.md) |
| **Frontend Standards** | React 19, TypeScript 5.7, Vite 6, CSS patterns | [programming/frontend-standards.md](programming/frontend-standards.md) |
| **Backend Standards** | Python 3.11, FastAPI, gRPC, Kafka, SQLAlchemy | [programming/backend-standards.md](programming/backend-standards.md) |
| **Testing Overview** | ⭐ Main testing hub (strategy, tools, quick start) | [programming/testing-overview.md](programming/testing-overview.md) |
| **Testing - Unit** | Unit testing (Vitest + RTL, pytest) | [programming/testing-unit.md](programming/testing-unit.md) |
| **Testing - Integration** | Integration testing (MSW, API stubs) | [programming/testing-integration.md](programming/testing-integration.md) |
| **Testing - E2E** | End-to-end testing (Playwright) | [programming/testing-e2e.md](programming/testing-e2e.md) |
| **Testing - Best Practices** | Flaky tests, isolation, coverage | [programming/testing-best-practices.md](programming/testing-best-practices.md) |
| **Testing - Visual (OPTIONAL)** | Visual regression (NOT IMPLEMENTED) | [programming/testing-visual.md](programming/testing-visual.md) |
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

### 📁 Components
**Location:** `docs/components/`

Detailed documentation for individual UI components.

**✅ COMPLETE** - All 19 components fully documented!

| Component | Description | Path |
|-----------|-------------|------|
| **Badge** | Status indicators and labels (5 variants) | [components/Badge.md](components/Badge.md) |
| **BasePage** | Page layout with keyboard shortcuts & analytics | [components/BasePage.md](components/BasePage.md) |
| **Button** | Primary action button (5 variants, 4 sizes) | [components/Button.md](components/Button.md) |
| **Card** | Container component with interaction states | [components/Card.md](components/Card.md) |
| **Checkbox** | Checkbox input with indeterminate state | [components/Checkbox.md](components/Checkbox.md) |
| **DashboardCard** | Navigation cards with icons | [components/DashboardCard.md](components/DashboardCard.md) |
| **DebugBar** | Developer debugging toolbar with analytics | [components/DebugBar.md](components/DebugBar.md) |
| **EmptyState** | Empty state UI with icon & action button | [components/EmptyState.md](components/EmptyState.md) |
| **FormField** | Form wrapper with validation & error messages | [components/FormField.md](components/FormField.md) |
| **Input** | Text input field (pure styling, no validation) | [components/Input.md](components/Input.md) |
| **Modal** | Modal dialog with drag & nested modal support | [components/Modal.md](components/Modal.md) |
| **Radio** | Radio button input | [components/Radio.md](components/Radio.md) |
| **RadioGroup** | Radio button group management | [components/RadioGroup.md](components/RadioGroup.md) |
| **Select** | Native dropdown with custom arrow | [components/Select.md](components/Select.md) |
| **Spinner** | Loading spinner animation (3 sizes) | [components/Spinner.md](components/Spinner.md) |
| **Toast** | Toast notification element (4 types) | [components/Toast.md](components/Toast.md) |
| **ToastContainer** | Toast container (6 positions) | [components/ToastContainer.md](components/ToastContainer.md) |
| **WizardNavigation** | Wizard step navigation buttons | [components/WizardNavigation.md](components/WizardNavigation.md) |
| **WizardProgress** | Wizard progress indicator (3 variants) | [components/WizardProgress.md](components/WizardProgress.md) |

**Template Available:** [templates/COMPONENT_TEMPLATE.md](templates/COMPONENT_TEMPLATE.md)

---

### 📁 Hooks
**Location:** `docs/hooks/`

Detailed documentation for React hooks and custom hooks.

**✅ COMPLETE** - All 5 hooks fully documented!

| Hook | Description | Path |
|------|-------------|------|
| **useFormDirty** | Tracks form changes and dirty state | [hooks/useFormDirty.md](hooks/useFormDirty.md) |
| **useModal** | Modal state management with callbacks | [hooks/useModal.md](hooks/useModal.md) |
| **useModalWizard** | Multi-step wizard workflows | [hooks/useModalWizard.md](hooks/useModalWizard.md) |
| **usePageAnalytics** | User interaction analytics tracking | [hooks/usePageAnalytics.md](hooks/usePageAnalytics.md) |
| **useToast** | Toast notifications API | [hooks/useToast.md](hooks/useToast.md) |

**Template Available:** [templates/HOOK_TEMPLATE.md](templates/HOOK_TEMPLATE.md)

---

### 📁 Utilities
**Location:** `docs/utils/`

Detailed documentation for utility functions (validation, formatting, etc.).

**✅ COMPLETE** - All 5 utilities fully documented!

| Utility | Description | Path |
|---------|-------------|------|
| **dateUtils** | Date formatting, parsing, validation (9 functions) | [utils/dateUtils.md](utils/dateUtils.md) |
| **emailUtils** | Email validation, parsing (5 functions) | [utils/emailUtils.md](utils/emailUtils.md) |
| **modalStack** | Modal stack management (9 methods) | [utils/modalStack.md](utils/modalStack.md) |
| **phoneUtils** | Phone validation, formatting (5 functions) | [utils/phoneUtils.md](utils/phoneUtils.md) |
| **toastManager** | Toast state management (5 methods) | [utils/toastManager.md](utils/toastManager.md) |

**Template Available:** [templates/UTILITY_TEMPLATE.md](templates/UTILITY_TEMPLATE.md)

---

### 📁 Templates
**Location:** `docs/templates/`

Documentation templates for consistent documentation across the project.

| Template | Purpose | Path |
|----------|---------|------|
| **COMPONENT_TEMPLATE.md** | Template for UI component documentation | [templates/COMPONENT_TEMPLATE.md](templates/COMPONENT_TEMPLATE.md) |
| **HOOK_TEMPLATE.md** | Template for hook documentation | [templates/HOOK_TEMPLATE.md](templates/HOOK_TEMPLATE.md) |
| **UTILITY_TEMPLATE.md** | Template for utility function documentation | [templates/UTILITY_TEMPLATE.md](templates/UTILITY_TEMPLATE.md) |

**How to Use:**
1. Copy the appropriate template file
2. Rename to match your component/hook/utility name
3. Fill in all sections (remove placeholders)
4. Save to appropriate folder (components/, hooks/, utils/)
5. Update this README.md with link to new documentation

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

| Type of Documentation | Location | Template |
|----------------------|----------|----------|
| Project roadmap updates | `project/roadmap.md` | N/A |
| Setup/installation changes | `setup/getting-started.md` | N/A |
| New problem solved | `setup/troubleshooting.md` | N/A |
| New coding standard | `programming/coding-standards.md` | N/A |
| Documentation guide | `programming/documentation-standards.md` | N/A |
| New code example | `programming/code-examples.md` | N/A |
| **New component** | **`components/<ComponentName>.md`** | **`templates/COMPONENT_TEMPLATE.md`** |
| **New hook** | **`hooks/<hookName>.md`** | **`templates/HOOK_TEMPLATE.md`** |
| **New utility** | **`utils/<utility-name>.md`** | **`templates/UTILITY_TEMPLATE.md`** |
| New package documentation | `packages/<package-name>.md` | N/A |
| Architecture decisions | `architecture/<topic>.md` | N/A |
| Temporary planning | `temp/<task-name>.md` | N/A |

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

**Last Updated:** 2025-10-20
**Maintainer:** BOSSystems s.r.o.
**Documentation Location:** `L:\system\lkern_codebase_v4_act\docs\`
**Documentation Version:** 3.0.0
**Documentation Status:** ✅ 100% COMPLETE (29/29 items documented)
