# TaskAssist

This project leverages Google OAuth and the Google Tasks APIs to allow for simple drag-and-drop prioritization of your Google tasks.  This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Features/Usage

### The Eisenhower Matrix

This app allows you to rearrange your "to do" list using an Eisenhower Matrix.  This method allows you to set your real priorities so you can meet your true goals.

### Logging in

This app does not have any remote data servers, and no task information is collected.  After logging in with your Google account, the UI interacts directly with Google services.

### Adding Tasks

You must have a Google Task List set up to use this app.  Tasks must be added via the various apps that Google provides.  Links to those UIs are available in the menu of this app.

## To-do List

* Rig up API to fetch tasks and display
* Rig up API to modify items upon drag/drop
* Support list selection for users with multiple lists
* Commit resorting order if user drags items up/down
* Tool tips to preview task details (due date, notes, links, etc.)
* Enable auto-refresh when data is edited elsewhere
* Flesh out UI for tighter integration with task creation
* Ability to tag items with cost/complexity and identify items that may not be in the right quadrant
* Utilize [Karma](https://karma-runner.github.io) for unit testing
* Utilize [Protractor](http://www.protractortest.org/) for  end-to-end testing