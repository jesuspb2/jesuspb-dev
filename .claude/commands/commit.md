Follow these steps in order:

1. Run `npm run build` to verify the project builds successfully. If it fails, fix all errors before proceeding.
2. Run `git diff` and `git status` to review all changes. Check for any sensitive data (API keys, tokens, passwords, secrets, `.env` files). If anything sensitive is found, warn the user and do not proceed.
3. If clean, generate a concise commit message based on the changes, then run `git add` on all modified/untracked files (excluding sensitive ones) and `git commit` with the generated message.
