# PR preview instances

A GitHub Actions workflow exist in this project that allow to deploy a clean preview instance of a PR to Clever Cloud.

This is done automatically for all PRs that have the `cc-preview` label.

The instance will be updated on every push to the PR.

The instance will be deleted when the pull request is closed.

The workflow can be manually triggered using the `workflow_dispatch` event.
This is useful in case the deployment fails (for example because the log stream to Clever Cloud fails to connect), and needs to be restarted without pushing a code change.
