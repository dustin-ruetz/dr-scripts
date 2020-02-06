# dr-scripts

CLI toolbox providing common scripts for Node.js projects.

Adapted from Kent C. Dodds' [kcd-scripts][kcd-scripts] package and ["How toolkits (like react-scripts) work"][how-toolkits-work] video.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Purpose](#purpose)
- [Installation](#installation)
- [Usage](#usage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Purpose

dr-scripts is a CLI tool that abstracts away configuration for Node.js projects. It's responsible for:

- Formatting
- Initializing new repositories (see below for Usage)
- Linting
- Testing
- Validating commit messages
- Validating the codebase pre-commit

## Installation

To work on this toolbox:

1. Prerequisite: Have [Node.js][nodejs] and [NPM][npm] installed.
1. Clone the repository and `cd` into it.
1. Run `npm install`.

## Usage

When creating a new repository/starting a new project:

1. Create and intialize a new Git repository: `mkdir repo-name && cd repo-name && git init`
1. Initialize the project with a name and files: `npx dr-scripts init-repo repo-name`
1. Install dr-scripts as a development dependency: `npm install --save-dev dr-scripts`

After completing the above steps, open the `package.json` file to see the results of the `init-repo` script.

[how-toolkits-work]: https://www.youtube.com/watch/?v=ZWfY-v1DCTE
[kcd-scripts]: https://github.com/kentcdodds/kcd-scripts/
[npm]: https://www.npmjs.com/
[nodejs]: https://nodejs.org/en/download/
