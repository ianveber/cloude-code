---
name: interface-design
description: Design engineering for Claude Code with craft, memory, and enforcement for consistent UI. Use this skill whenever building dashboards, apps, tools, or admin panels that need design consistency across multiple sessions and components. Trigger on "consistent UI", "design system memory", "keep styles consistent", "remember design decisions", "design tokens", or any multi-session build where visual coherence matters. NOT for marketing or landing pages — use for interface-heavy apps.
---

# Interface Design

Source: github.com/Dammyjay93/interface-design (1.6k stars, MIT)
Craft · Memory · Consistency

Build interfaces with intention. Remember design decisions across sessions. Maintain systematic visual coherence.

## Core Problem This Solves

Without this skill, AI-generated UI drifts:
- Button heights vary (36px, 38px, 40px...)
- Random spacing values (14px, 17px, 22px...)
- No consistency between components built in different sessions
- Every session starts from scratch

With this skill:
- Design decisions saved to `.interface-design/system.md`, loaded automatically
- Patterns reused consistently (Button: 36px, Card: 16px padding)
- Spacing always on grid (4/8/12/16/24/32px)
- Consistent depth and surface treatment throughout

## Workflow

### If system.md exists (returning session)
1. Read `.interface-design/system.md`
2. Apply all established patterns silently
3. State design choices before each component
4. Offer to save any new patterns discovered

### If no system.md (first session)
1. Assess project context
2. Suggest direction — ask for confirmation before proceeding
3. State design choices before each component
4. Build with consistent principles throughout
5. Offer to save system to `.interface-design/system.md`

### Example — First Session
```
User: "Build a user dashboard with metrics cards"

Claude:
This feels like a data-heavy dashboard. I'd suggest:
- Depth: Borders-only (clean, technical feel)
- Surfaces: Subtle elevation shifts (7% to 9% to 11% lightness)
- Spacing: 8px base grid
- Borders: rgba(255,255,255,0.06)

Does this direction fit?

[User: y]
[Builds with consistent depth, spacing, surfaces throughout]

Want me to save these patterns to .interface-design/system.md?
```

### Example — Second Session
```
User: "Add a settings page"

Claude: Loaded system.md
Applying: borders-only depth, 8px spacing, established surface scale
[Builds settings page matching existing system automatically]
```

## Design Principles

### Depth Systems (choose one, apply everywhere)
- **Borders-only**: Clean, technical. Use rgba(255,255,255,0.06) borders, no shadows
- **Subtle elevation**: 3-level lightness scale (7%/9%/11% for dark)
- **Shadow elevation**: Defined shadow scale (none/sm/md/lg), never arbitrary

### Spacing Grid — always multiples of 4px
- xs: 4px | sm: 8px | md: 12/16px | lg: 24/32px | xl: 48/64px
- Never use arbitrary values like 14px, 17px, 22px, 33px

### Surface Scale (dark mode)
```css
--surface-0: hsl(220, 15%, 7%);   /* Page bg */
--surface-1: hsl(220, 15%, 9%);   /* Cards */
--surface-2: hsl(220, 15%, 11%);  /* Elevated panels */
--surface-3: hsl(220, 15%, 13%);  /* Modals, dropdowns */
```

### Component Consistency Rules
- All primary buttons: same height — pick 36px or 40px
- All inputs: same height — match buttons
- All cards: same border-radius — pick 8px, 12px, or 16px
- All card padding: same — pick 16px, 20px, or 24px
- Icon sizes: 16px (inline), 20px (standalone), 24px (prominent)

### Color Token System
```css
--color-primary:        #C8960C;
--color-primary-hover:  #E8B84B;
--color-primary-subtle: rgba(200,150,12,0.12);
--color-border:         rgba(255,255,255,0.08);
--color-border-hover:   rgba(255,255,255,0.16);
--color-text-primary:   #F0E8D0;
--color-text-secondary: #A89880;
--color-text-muted:     #5A5248;
```

### Typography Scale — lock this and never deviate
```css
--text-xs:   12px; --text-sm: 14px; --text-base: 16px;
--text-lg:   18px; --text-xl: 20px; --text-2xl:  24px;
--text-3xl:  30px; --text-4xl: 36px;
/* Weights: 400 body / 500 medium+labels / 600 headings */
```

## The system.md File Format

```markdown
# Interface Design System

## Depth Strategy
borders-only

## Surface Scale
Base: hsl(220, 15%, 7%)
Level 1: hsl(220, 15%, 9%)
Level 2: hsl(220, 15%, 11%)

## Spacing
Base unit: 8px

## Typography
Scale: 12/14/16/18/24/30/36
Weights: 400/500/600

## Components
Button height: 36px
Input height: 36px
Card radius: 12px
Card padding: 20px
Icon sizes: 16/20/24

## Colors
Primary: [value]
Border: [value]

## Patterns
[Project-specific patterns]
```

## Design Checkpoint (before each component)
Before building any component, state:
1. Which depth strategy is being applied
2. Which spacing values will be used
3. Any new pattern decisions
4. Whether this matches the established system

## Slash Commands
- `/interface-design` — Start session or load existing system
- `/interface-design status` — Show current system settings
- `/interface-design audit` — Review for consistency violations
- `/interface-design extract` — Extract patterns from existing code
