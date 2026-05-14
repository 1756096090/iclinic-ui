---
<!--Name(Obligatorio): 64 caracteres-->
name: pr-description
<!--Description(Obligatorio): 1024 caracteres-->
description: Write a pull request description. Use when create a PR, or when the user asks to summarize changes for a pull request.
<!--Allowed tools(Obligatorio): 1024 caracteres-->
allowed-tools: Bash, Read
model: sunnet

---

When writing a PR description:

1. Run `git diff main...HEAD` to see all changes on this branch
2. Write a description following this format:

## What
One sentence explaining what this PR does.

## Why
Brief context on why this change is needed

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted or renamed

## Testing
How to verify this works. Include specific commands if relevant.

Keep descriptions concise. Focus on what a reviewer needs to know.