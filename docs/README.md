# L-KERN v4 Documentation

**Version**: 4.0.0
**Status**: 🚧 In Development
**Last Updated**: 2025-10-13

---

## 📚 Documentation Structure

### **Core Documentation**
- [Project Overview](PROJECT-OVERVIEW.md) - Project goals, status, architecture
- [Roadmap](ROADMAP.md) - Development phases and milestones (planned)

### **Architecture**
- [Main Architecture](architecture/main-architecture.md) - System architecture overview (planned)
- [Port Mapping Strategy](architecture/port-mapping.md) - LKMS service port mapping

### **Packages**
- [@l-kern/config](packages/config.md) - Shared configuration, constants, translations, theme

### **Programming**
- [Coding Standards](programming/coding-standards.md) - Code style and conventions (planned)
- [Code Examples](programming/code-examples.md) - Practical code examples (planned)

### **Design**
- [Design Standards](design/design-standards.md) - UI/UX guidelines (planned)
- [Component Library](design/component-library.md) - Reusable React components (planned)

---

## 🎯 Quick Start

1. **Read** [Project Overview](PROJECT-OVERVIEW.md) - Understand project goals
2. **Check** [Port Mapping](architecture/port-mapping.md) - Service port strategy
3. **Review** [@l-kern/config](packages/config.md) - Shared package usage
4. **Follow** Coding Standards (coming soon) - Write consistent code

---

## 📖 Documentation Guidelines

### **Structure Principles**
- ✅ **Single entry point** - All docs accessible from this README
- ✅ **Clear hierarchy** - Logical folder structure
- ✅ **Cross-references** - Links between related documents
- ✅ **Up-to-date** - Regular updates with code changes

### **File Organization**
```
docs/
├── README.md                    # This file - main documentation index
├── PROJECT-OVERVIEW.md          # Project goals and current status
├── ROADMAP.md                   # Development roadmap (planned)
├── architecture/                # System architecture docs
│   ├── main-architecture.md     # Overall architecture
│   └── port-mapping.md          # Port mapping strategy
├── packages/                    # Package-specific documentation
│   ├── config.md                # @l-kern/config package
│   └── [other-packages].md      # Future packages
├── programming/                 # Coding guidelines
│   ├── coding-standards.md      # Code conventions
│   └── code-examples.md         # Practical examples
└── design/                      # Design and UI docs
    ├── design-standards.md      # Design system
    └── component-library.md     # React components
```

### **Package README Guidelines**
Each package should have minimal `README.md` that:
- States package name and version
- Links to detailed documentation in `docs/packages/[package-name].md`
- Provides quick usage example

**Example:**
```markdown
# @l-kern/config

**Documentation**: [docs/packages/config.md](../../docs/packages/config.md)

Quick usage:
\`\`\`typescript
import { PORTS, useTranslation } from '@l-kern/config';
\`\`\`
```

---

## 🔍 Finding Documentation

### By Topic
- **Configuration** → [packages/config.md](packages/config.md)
- **Port mapping** → [architecture/port-mapping.md](architecture/port-mapping.md)
- **Project status** → [PROJECT-OVERVIEW.md](PROJECT-OVERVIEW.md)

### By Package
- `@l-kern/config` → [packages/config.md](packages/config.md)

---

## 📝 Contributing to Documentation

When adding new features:
1. ✅ **Update relevant docs** in `docs/` folder
2. ✅ **Add links** to this README if new section
3. ✅ **Keep package READMEs minimal** with links to full docs
4. ✅ **Cross-reference** related documents

---

**Maintainer**: BOSSystems s.r.o.
**Project**: L-KERN v4 - Business Operating System Software
