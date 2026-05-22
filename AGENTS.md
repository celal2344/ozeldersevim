<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Documentation Rules

- Use `CONTEXT.md` for product/domain vocabulary and decisions.
- Use `LANGUAGE.md` for architecture vocabulary and code organization rules.
- When the user gives a critical codebase rule, architecture rule, domain decision, or workflow decision, update the relevant Markdown documentation in the same change.
- Source files with Turkish UI copy must stay UTF-8; check for mojibake markers such as `Ã`, `Ä`, or `Å` before committing.
