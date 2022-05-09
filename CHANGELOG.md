# CHANGELOG

## Introduction

This CHANGELOG tells you:

* when a release was made
* what is in each release

It also tells you what changes have been completed, and will be included in the next tagged release.

For each release, changes are grouped under these headings:

* _Backwards-Compatibility Breaks_: a list of any backwards-compatibility breaks
* _New_: a list of new features. If the feature came from a contributor via a PR, make sure you link to the PR and give them a mention here.
* _Fixes_: a list of bugs that have been fixed. If there's an issue for the bug, make sure you link to the GitHub issue here.
* _Dependencies_: a list of dependencies that have been added / updated / removed.
* _Tools_: a list of bundled tools that have been added / updated / removed.

## develop branch

The following changes have been completed, and will be included in the next tagged release.

### Fixes

- `makeObjectRequirements()` now passes the generic type needed for ObjectRequirements.validate() to return the correct type
- `validateRequiredObjectProperties()` (and therefore ObjectRequirements.validate()) now checks every required property (as long as the validators keep passing)
- `validateOptionalObjectProperties()` (and therefore ObjectRequirements.validate()) now checks every optional property (as long as the validators keep passing)

## v0.0.1

Released Monday, 9th May 2022.

Initial release.
