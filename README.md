# TaskAssist

This project leverages Google OAuth and the Google Tasks APIs to allow for simple drag-and-drop prioritization of your Google tasks.  This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Features/Usage

### The Eisenhower Matrix

This app is currently in read-only mode.  This intent is to create an app that allows people rearrange their priorities using  an "Eisenhower Matrix".

### Logging in

This app does not have any remote data servers, and no task information is collected.  After logging in with your Google account, the UI interacts directly with Google services.

### Adding Tasks

You must have a Google Task List set up to use this app.  Tasks must be added via the various apps that Google provides.  Links to those UIs are available in the menu of this app.

## Feature To-do List

* Save quadrant edits to Google's Task repository (Turn off "demo mode")
* Tool tips to preview task details (due date, notes, links, etc.)
* Save resorts and edits to Google's Task repository
* Enable auto-refresh when data is edited elsewhere
* Flesh out UI for tighter integration with task creation
* Ability to tag items with cost/complexity and identify items that may not be in the right quadrant

## Technical To-do List

* Handle all error cases, tidy up, and add comments
* Utilize [Karma](https://karma-runner.github.io) for unit testing
* Utilize [Protractor](http://www.protractortest.org/) for  end-to-end testing