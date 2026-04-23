Run `git diff` and `git status` to review all changes. Check for any sensitive data (API keys, tokens, passwords, secrets, `.env` files). If anything sensitive is found, warn the user and do not proceed.

If clean, generate a concise commit message based on the changes, then run `git add` on all modified/untracked files (excluding sensitive ones) and `git commit` with the generated message.
