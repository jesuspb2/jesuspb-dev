Follow these steps in order:

1. Run `npm run build` to verify the project builds successfully. If it fails, fix all errors before proceeding.
2. Run `git diff` and `git status` to review all changes. Check for any sensitive data (API keys, tokens, passwords, secrets, `.env` files). If anything sensitive is found, warn the user and do not proceed.
3. Inspect the untracked files list from `git status`. For any untracked file that clearly should not be committed (build artifacts, local tool directories, OS files, editor folders, cache dirs, etc.), check if it is already covered by `.gitignore`. If it is not, add it to `.gitignore`, commit the `.gitignore` change first with message `chore: add <entry> to .gitignore`, and warn the user with a `⚠️ WARN` message explaining what was added and why.
4. If clean, generate a concise commit message based on the changes, then run `git add` on all modified/untracked files (excluding sensitive ones and the ones just added to .gitignore) and `git commit` with the generated message.
5. After the commit succeeds, display the final commit message to the user in a code block.
