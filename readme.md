# FSCSS Support for Acode

Syntax highlighting and snippets for **FSCSS** (Figured Shorthand Cascading Style Sheets) in Acode.

---

## Installation

1. Download `fscss-acode-plugin.zip` from the [Releases](https://github.com/Figsh/fscss-acode-plugin/releases) page.
2. Open **Acode** and go to **Settings → Plugins** (or the **Extensions** tab).
3. Tap **`+` → LOCAL**, select `fscss-acode-plugin.zip`, and wait for installation to finish.
4. Open any `.fscss` or `.xfscss` file—highlighting activates automatically (or select **FSCSS** from the syntax mode selector).


---

## Features

### Syntax Highlighting

**FSCSS-aware highlighting for `.fscss` and `.xfscss` files**, including:

- `@define`, `pattern`, `@fun`, `@obj`
- `@import`, `@use`, `@match`
- `@arr`, `@event`, `@random`, `@ext`
- Built-in functions (`exec()`, `num()`, `rpt()`, `copy()`, `count()`, `inline()`, and more)
- Variables (`$color`, `$color!`), CSS custom properties (`--custom-props`), and shorthand helpers (`%2(...)`)
- Method helpers (`.randint`, `.list`, `.join`, `.length`, `.reverse`, and more)
- Backtick blocks with nested FSCSS highlighting

> Works alongside standard CSS without conflicts.

---

## Snippets Reference

### Core

Trigger | Description
--- | ---
`def` | Create `@define` function
`defc` | Call defined function
`fun` | Create `@fun` block
`obj` | Create `@obj` style object
`use` | Use selector inside define

### Imports

Trigger | Description
--- | ---
`imp` | Import module
`impm` | Multi import
`impa` | Alias import
`impw` | Import all (`*`)
`impr` | Import from URL

### Variables & Strings

Trigger | Description
--- | ---
`var` | Declare variable
`varu` | Use variable
`str` | Create string prompt
`stru` | Use string variable

### Arrays & Randomization

Trigger | Description
--- | ---
`arr` | Create array
`arrl` | Loop through array
`arrr` | Random per element
`arrri` | Global random
`ajon` | Join array
`arls` | Output list
`rand` | Inline random
`randa` | Random from array

### Utilities & Logic

Trigger | Description
--- | ---
`num` | Math evaluation
`cou` | Number range
`rpt` | Repeat values
`cpy` | Copy value
`ext` | Extract string
`even` | Conditional logic (`@event`)

### Animation & Selectors

Trigger | Description
--- | ---
`key` | Keyframes (single selector)
`keym` | Keyframes (multi selector)
`attr` | Attribute selector

### Debugging

Trigger | Description
--- | ---
`exe` | Console log
`exew` | Console warn

---

## Example

```css
@define center(elem){`
  @use(elem){
    display:flex;
    justify-content:center;
    align-items:center;
  }
`}

@center(.box)
```
Usage
 * Install FSCSS Support in Acode.
 * Open or create any .fscss or .xfscss file—highlighting activates automatically.
 * You can also select FSCSS manually from the editor's syntax mode menu.
Links
 * Website: https://fscss.devtem.org
 * VS Code Extension repo: https://github.com/Figsh/fscss-vscode-extension
