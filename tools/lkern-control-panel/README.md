# L-KERN Control Panel

**Version:** 1.6.4
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

**Build & Test Tab (🔧):**
- **Build:** Web-UI, All, Clean (Nx reset)
- **Test:** Web-UI, Config, UI-Components, All
- **Lint:** All

**Docker Tab (🐳):**
- **Global Controls:** 6 buttons for all containers (Start/Stop/Restart/Rebuild/List/Down)
- **Container List:** 1 container (Web-UI v4) with real-time status (auto-refresh every 1s)
- **Container States:** running, starting, restarting, exited, stopped, paused, dead, unhealthy, not found, unknown
- **Healthcheck Integration:** Shows "starting" when container is running but app not ready (healthcheck: starting/unhealthy)
- **Status Colors:**
  - Green: running (healthy)
  - Orange: starting, restarting, starting (healthcheck)
  - Red: exited, stopped, unhealthy
  - Gray: paused, dead, not found, unknown
- **Auto-Refresh:** Status updates every second automatically
- **Dropdown Menus:** Per-container actions (Start, Stop, Restart, Rebuild, Logs, Remove)
- **Refresh Button:** Manual status refresh (🔄)
- **Live Logs Button:** Follow container logs in real-time (🔍)

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

## 📝 Changelog

**v1.6.4 (2025-11-08):**
- ✨ **NEW: Auto-Refresh Status** - Container status updates every 1 second automatically
  - No more manual refresh needed - live updates in real-time
  - Detects when status changes (starting → running → healthy)
- ✨ **NEW: Healthcheck Integration** - Accurate application readiness detection
  - Shows "starting" (orange) when container is running but app not ready yet
  - Integrates with Docker healthcheck (wget test on port 4201)
  - Solves issue: container shows "running" but Vite still booting up
  - States: starting, unhealthy, healthy (running)
  - Now you know exactly when the web app is truly ready!

**v1.6.3 (2025-11-08):**
- ✨ **ENHANCED: Full Docker State Visibility** - Show all container states in real-time
  - Added states: starting, restarting, exited, paused, dead
  - Orange color (#FFA500) for starting/restarting states
  - Changed from `.State.Running` (boolean) to `.State.Status` (string)
  - Now you can see when container is booting up (starting/restarting)
  - Helpful for long startup times - no more guessing if it's still loading

**v1.6.2 (2025-11-08):**
- ✨ **NEW: Lint (No Cache) Button** - Added button to run lint without Nx cache
  - Command: `npx nx run-many -t lint --skip-nx-cache`
  - Performs fresh lint check without cached results
  - Located in Build & Test tab, Lint category
- 🎨 **UI: Removed ALL v3 Containers** - Removed all v3 project containers from Docker list
  - Removed: Web-UI (v3), Contacts Service, Contacts DB, Adminer
  - Only Web-UI (v4) container remains
  - Cleaner interface showing only active v4 container
  - Container count reduced from 5 to 1 container

**v1.6.1 (2025-11-08):**
- 🐛 **CRITICAL FIX: UTF-8 Encoding Error** - Fixed UnicodeDecodeError crash
  - Removed conflicting `universal_newlines=True` parameter
  - Added `errors='replace'` to handle invalid UTF-8 gracefully
  - Fixed: "UnicodeDecodeError: 'charmap' codec can't decode byte 0x90"
  - Now properly uses UTF-8 encoding on Windows

**v1.6.0 (2025-11-08):**
- ✨ **NEW: Live Logs Button** - Follow container logs in real-time
  - Changed refresh icon: 🔍 → 🔄 (clearer meaning)
  - New 🔍 button streams live logs to terminal (`docker logs --follow`)
  - Shows last 50 lines and continues streaming
  - Tooltip: "Follow logs (live)" vs "Refresh status"

**v1.5.3 (2025-11-08):**
- 🎨 **UI: Wider Docker Tab Panel** - Increased left panel width for better fit
  - Panel width: 300px → 380px (+80px)
  - Adjusted container row element widths for optimal layout
  - All Docker controls now fit properly without overflow

**v1.5.2 (2025-11-08):**
- ✨ **UI: Tooltip on Refresh Button** - Added hover tooltip "Refresh status" on 🔍 button
  - Tooltip appears on hover with blue background
  - Makes it clear what the magnifying glass button does

**v1.5.1 (2025-11-08):**
- 🎨 **UI: Text Status Labels** - Replaced emoji status with text labels
  - Status displayed as text: "running", "stopped", "not found", "unknown"
  - Color-coded: Green (running), Red (stopped), Gray (not found/unknown)
  - Small font (8pt) for status, easier to read than emoji

**v1.5.0 (2025-11-08):**
- ✨ **REDESIGNED: Docker Control Tab** - Container-centric UI
  - Container list with live status indicators
  - Dropdown menu per container (6 actions: Start/Stop/Restart/Rebuild/Logs/Remove)
  - Global controls section (6 buttons for all containers)
  - Auto status check on load + manual refresh button
  - Much cleaner and more intuitive layout

**v1.4.0 (2025-11-08):**
- ✨ **NEW: Docker Control Tab** - Complete Docker container management
  - Docker-All: Start/Stop/Restart/Rebuild/Down/Clean all containers
  - Docker-WebUI: Individual Web-UI container control
  - Docker-Logs: View logs for all 5 containers (Web-UI v4/v3, Contacts, DB, Adminer)
  - 18 new Docker commands added to config.json
  - New tabbed interface with 🐳 Docker tab

**v1.3.4 (2025-11-08):**
- 🐛 Fixed UTF-8 encoding for Docker output (emoji checkmarks now display correctly)
- Added explicit `encoding='utf-8'` to subprocess.Popen

**v1.3.3 (2025-11-06):**
- Previous stable release

---

**Last Updated:** 2025-11-08
