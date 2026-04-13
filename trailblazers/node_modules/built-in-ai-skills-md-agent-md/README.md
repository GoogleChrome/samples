# built-in-ai-skills-md-agent-md

An npm package that automatically teaches your AI agent about the latest
Built-in AI APIs and their polyfills.

## What it does

Upon installation, this package adds or appends to `SKILL.md` and `AGENTS.md` in
your project root. These files:

- Inform the AI about the deprecation of `window.ai.*` in favor of top-level
  APIs (e.g., `window.LanguageModel`).
- Provide the latest Web IDLs for Translation, Writing Assistance, and Prompt
  APIs.
- Make the AI aware of critical polyfills.
- Set a persona for the AI as a "Built-in AI Expert".

## Usage

### With npm

Simply install the package:

```bash
npm install built-in-ai-skills-md-agent-md
```

The `SKILL.md` and `AGENTS.md` files will be automatically created or updated in
your project root.

### With the `skills` command

Run the [`skills` command](https://skills.sh/) and follow the wizard:

```bash
npx skills add GoogleChromeLabs/web-ai-demos
```

## Updating IDLs

To fetch the latest IDLs from the official webmachinelearning specifications,
run:

```bash
npm run update-idls
```
