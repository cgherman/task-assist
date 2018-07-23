# TaskAssist

This demo project leverages the Google OAuth2 API and the Google Tasks API.This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Features/Usage

### The Eisenhower Matrix

The intent of this project is to create a simple drag-and-drop app that allows people rearrange their priorities using an "Eisenhower Matrix".

### Logging in

This app does not have any remote data servers, and no task information is collected.  After logging in with your Google account, the UI interacts directly with Google services.

### Adding Tasks

You must have a Google Task List set up to use this app.  Tasks must be added via the various apps that Google provides.  Links to those UIs are available in the menu of this app.

## Feature To-do List

* Optimize update behavior, to reduce lag, by only fetching partial data for refresh
* Paging mechanism, or similar, to account for large number of tasks
* Option to hide sub-tasks to reduce clutter
* Enable auto-refresh when data is edited elsewhere
* Tool tips to preview task details (due date, notes, links, etc.)
* Flesh out UI for tighter integration with task creation
* Enable text edits and resorts and save to Google's Task repository
* Ability to tag items with cost/complexity and identify items that may not be in the right quadrant
* If API key changes, an invalid credentials error will occur, so log out the user

## Technical To-do List

* Handle error cases, tidy up, and add code comments
* Utilize [Karma](https://karma-runner.github.io) for unit testing
* Utilize [Protractor](http://www.protractortest.org/) for  end-to-end testing