# L-KERN Control Panel

**Version:** 1.3.3
**Status:** ✅ Production Ready

Lightweight Python + Tkinter desktop app for L-KERN development workflow automation with ANSI color support.

---

## 🚀 Quick Start

### Option 1: Launcher (Recommended)
```bash
# From project root
cd L:\system\lkern_codebase_v4_act
control-panel.bat
```

### Option 2: Direct Python
```bash
cd L:\system\lkern_codebase_v4_act\tools\lkern-control-panel
python main.py
```

**That's it!** No dependencies needed (Tkinter built-in).

---

## ⚡ Recommended Workflow

**Quick Development (Lint → Test → Build):**
```
1. Lint All    - Fast quality check (1-3s) ✅
2. Test All    - Verify functionality (10-20s)
3. Build All   - Compile if needed (30-60s)
```

**Full Production (Clean → Lint → Build → Test):**
```
1. Clean       - Clear Nx cache (2-3s)
2. Lint All    - Code quality (1-3s) ✅
3. Build All   - Production build (30-60s)
4. Test All    - Final verification (10-20s)
```

**💡 Tip:** Run **Lint first** - fastest feedback, catches errors before wasting time on build!

---

## 📋 Features

### Core Functionality
- ✅ **8 Preset Commands** - Build, Test, Lint shortcuts
- ✅ **Docker Integration** - All commands run in Docker container
- ✅ **Live Terminal Output** - Real-time command execution with ANSI color formatting
- ✅ **Workflow Hint Box** - Built-in recommended workflow guide (💡 Recommended Workflow)
- ✅ **Auto-scroll Toggle** - Checkbox to control scrolling
- ✅ **Clear Terminal** - One-click output clearing (🗑️ button)
- ✅ **Enhanced Command History** - Last 20 commands with emoji status (✅/❌), labels, duration
- ✅ **Stop/Kill Process** - Graceful termination button
- ✅ **Dark Mode UI** - VSCode-inspired theme

### Available Commands
**Build:**
- Build Web-UI
- Build All
- Clean (Nx reset)

**Test:**
- Test Web-UI
- Test Config
- Test UI-Components
- Test All

**Lint:**
- Lint All

---

## ⚙️ Configuration

### Adding Custom Commands

Edit `config.json` and add new command:

```json
{
  "docker_up": {
    "label": "Docker Up",
    "command": "docker-compose up -d",
    "category": "Docker",
    "description": "Start Docker containers"
  }
}
```

Restart app to see new button!

---

## 🎨 UI Features

### Terminal
- **Live streaming** - Real-time output (<50ms latency)
- **Colored output** - Success (green), Error (red), Info (blue)
- **Auto-scroll toggle** - Checkbox to enable/disable automatic scrolling
- **Manual scroll** - Scroll freely when auto-scroll disabled

### Buttons
- **Category grouped** - Build, Test, Lint sections
- **One-click execution** - No typing commands
- **Visual feedback** - Hover and active states

### History
- **Last 20 commands** - With timestamps and exit codes
- **FIFO overflow** - Oldest removed when 21st added
- **Clear button** - Remove all entries

---

## 📖 Full Documentation

See **[lkern-control-panel.md](./lkern-control-panel.md)** for comprehensive documentation:

- Configuration API
- Visual design details
- Behavior specifications
- Accessibility features
- Usage examples
- Contributing guide
- Troubleshooting

---

## 🧪 Testing

### Manual Testing
```bash
# Launch app
python main.py

# Test workflow:
1. Click [Clean] - Clear Nx cache
2. Click [Build All] - Build all projects
3. Click [Test All] - Run all tests
4. Check terminal output
5. Verify history updates
```

### Auto-scroll Test
```
1. Click [Build All]
2. Uncheck "☑ Auto-scroll"
3. Scroll up in terminal
4. Output continues without auto-scrolling
5. Re-check checkbox
6. Terminal jumps to bottom
```

---

## 🐛 Known Issues

**No known issues** ✅

---

## 🔧 Requirements

- **Python:** 3.8+ (with tkinter)
- **Node.js:** 18+ (for nx commands)
- **L-KERN:** v4 workspace

---

## 📞 Support

- **Documentation:** [lkern-control-panel.md](./lkern-control-panel.md)
- **Project:** BOSS (Business Operating System Service)
- **Developer:** BOSSystems s.r.o.

---

## 📝 License

Internal tool for L-KERN v4 project.

---

**Last Updated:** 2025-11-06
