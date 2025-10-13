# L-KERN v4 - Project Overview

**Version**: 4.0.0
**Created**: 2025-10-13
**Status**: 🚀 Initial Setup
**Commercial Name**: BOSS (Business Operating System Software)
**Developer**: BOSSystems s.r.o.

---

## 🎯 Project Goal

L-KERN v4 is a **clean slate ERP system** built with lessons learned from v3. Focus on **simplicity, maintainability, and clarity**.

### **Why Clean Slate?**

L-KERN v3 archived due to:
- Excessive complexity
- Poor maintainability
- Technical debt

L-KERN v4 principles:
- ✅ **Simplicity First**
- ✅ **Clear Architecture**
- ✅ **Incremental Development**
- ✅ **Quality Code**

---

## 📋 Current TODO - Phase 0: Foundation

**Status**: ⏳ IN PROGRESS

### **Tasks:**

1. ✅ **Nx Workspace**
   - ✅ Folder structure
   - ✅ package.json
   - ✅ nx.json
   - ✅ tsconfig.base.json
   - ✅ .gitignore

2. ⏳ **Documentation**
   - ✅ PROJECT-OVERVIEW.md
   - ⏳ ROADMAP.md
   - ⏳ Coding standards
   - ⏳ Architecture overview

3. ⏳ **First Package (@l-kern/config)**
   - ⏳ Package structure
   - ⏳ Constants
   - ⏳ Translations
   - ⏳ API config

---

## 🏗️ Architecture

```
L-KERN v4/
├── apps/              # Frontend apps
├── packages/          # Shared libs (@l-kern/*)
├── services/          # Backend (lkms###)
├── tools/             # Dev tools
├── infrastructure/    # Docker, K8s
└── docs/              # Documentation
```

### **Tech Stack:**

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: FastAPI + PostgreSQL
- **Monorepo**: Nx + Yarn Workspaces

---

## ✅ Completed

- ✅ Nx workspace initialized
- ✅ Folder structure created
- ✅ Basic config files

---

## ⏳ Next Steps

- Documentation structure
- Coding standards
- First shared package

---

**Last Updated**: 2025-10-13
