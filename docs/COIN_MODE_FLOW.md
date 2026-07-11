# Coin Mode Flow

This document defines how Codex reads and implements Coin component modes from Figma and Better LLM context.

## Core model

Coin components can participate in several independent mode collections at the same time. Collections such as `Color Mode`, `AppearanceBrand`, `Emphasis`, `Context`, `Context2`, `Context4`, `context 10`, size, state, and component-specific collections are not interchangeable. Their exact names, casing, selected values, and ownership must be preserved.

A component's appearance is the resolved result of its complete mode flow—not a manually selected fill, label color, icon color, border, radius, or effect.

## Ownership

- Set a mode on the public component that owns that context.
- Do not move a mode to a visually affected descendant merely to obtain the desired result.
- Example: Badge owns `Context4`. A normal Badge uses `Context4: Badge`; a glass Badge uses `Context4: Badge/glass`.
- Badge then cascades its context to internal or slotted children such as Icon. Icon color is an output of that Badge context, not an independently chosen color.
- Components may own several context collections simultaneously. Preserve all of them; do not collapse them into one generic context prop.

## Cascading

Better LLM context must record both the mode selected on the owner and the effective mode received by every nested instance. This makes the cascade inspectable without exposing or modifying the variables library.

Implementation configures the owning public component and relies on the Coin component's documented cascade. It must not:

- repeat owner modes on children as a visual patch;
- assign literal colors to reproduce resolved tokens;
- recreate hidden subcomponent behavior;
- add CSS or wrappers to compensate for a failed cascade.

If an owner has the correct modes but a child resolves incorrectly, report a Coin component cascading bug.

## Better LLM context requirements

For every public component instance and nested instance, export:

- node ID, component key, component name, and owning parent;
- explicitly selected modes;
- effective/inherited modes;
- source node for each effective mode;
- exact collection names and values, including capitalization and spaces;
- component properties, slots, and visibility;
- whether a value is explicit, inherited, or the component default;
- the rendered reference screenshot.

The package must preserve multiple simultaneous contexts. An implementation agent must never guess a missing context from the final color.

## Implementation sequence

1. Identify the public Coin component and its owner in Figma.
2. Read all selected and effective modes from Better LLM context.
3. Apply those modes to the owning public component using the Coin API.
4. Keep nested components inside the documented slots so mode cascading remains intact.
5. Render the screen and verify resolved outputs against the Figma screenshot.
6. If the mode flow is correct but the output differs, record a Coin component or platform-integration bug. Do not patch the screen.

## QA evidence

For every contextual component, QA records:

- Figma owner and selected modes;
- nested child and effective modes;
- rendered token output;
- whether cascading passed;
- any Coin component/platform bug.

Correct pixels alone do not pass if they were achieved with literals, duplicated child modes, CSS overrides, or recreated internals.
