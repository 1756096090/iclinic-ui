---
<!--Name(Obligatorio): 64 caracteres-->
name: pr-description
<!--Description(Obligatorio): 1024 caracteres-->
description: Write a pull request description and push changes to remote. Analyzes git changes, creates a comprehensive PR description, and handles the push workflow. Use when creating a PR or when the user asks to summarize and push changes.
<!--Allowed tools(Obligatorio): 1024 caracteres-->
allowed-tools: Bash, Read, Terminal
model: sunnet

---

## Workflow: PR Description & Push

### Step 1: Analyze Changes
Run `git diff main...HEAD` to see all changes on this branch, including:
- Files modified, added, or deleted
- Lines added/removed
- Type of changes (features, bugfixes, refactoring)

### Step 2: Generate PR Description
Write a description following this structure:

```markdown
## What
One sentence explaining what this PR does.
Be clear and concise about the main purpose.

## Why
Brief context on why this change is needed:
- Problem being solved
- Feature being added
- Improvement being made

## Changes
- Bullet points of specific changes made
- Group related changes together
- Mention any files deleted, renamed, or restructured
- Include new components, services, or utilities created

## Scope
- Affected modules/features
- Impact on existing functionality

## Testing
- How to verify this works
- Include specific commands if relevant
- List any manual testing steps
- Mention unit/integration tests added

## Breaking Changes
- Highlight any breaking changes (if applicable)
- Migration guide for users (if needed)

## Screenshots/Demos
- Visual changes or new features (if applicable)
```

### Step 3: Commit Changes (if needed)
```bash
git add .
git commit -m "feat: [brief description of changes]"
```

### Step 4: Push to Remote
```bash
# Push to current branch
git push origin [branch-name]

# Or push and set upstream if pushing for first time
git push -u origin [branch-name]
```

### Step 5: Verify Push
```bash
# Check remote branch
git branch -r
# Or view GitHub/remote repo to confirm changes are visible
```

## Tips
- Keep descriptions concise but informative
- Review code changes before writing description
- Mention related issues/PRs if applicable
- Use clear language for non-technical reviewers
- Always test locally before pushing
- Verify branch protection rules are followed