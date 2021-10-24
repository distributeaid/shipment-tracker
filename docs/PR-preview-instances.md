# PR preview instances

A set of GitHub Actions workflows exist in this project that allow to deploy a clean preview instance of a PR to Clever Cloud.

This is done automatically for all PRs that have the `cc-preview` label.

The instance will be updated on every push to the PR.

The instance will be deleted when the pull request is closed.
