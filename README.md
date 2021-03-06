# TaskAssist

This demo project leverages the Google OAuth2 API and the Google Tasks API.  This project was created with [Angular CLI](https://github.com/angular/angular-cli) version 6.

To run this code locally, you must first install a few packages.  After you download the source code, navigate to the code directory run these installation commands:
* npm install -g @angular/cli
* npm install

After running the above installation commands, run "ng serve" to host the app locally.

## Features/Usage

### The Eisenhower Matrix

This project functions as a tech demo as well as a functional app that can used to help organize your personal tasks.  This app provides a simple drag-and-drop interface that allows you to prioritize your tasks using the "Eisenhower Matrix" method.

### Logging in

This app does not have any remote data servers, and no task information is collected.  After logging in with your Google account, the UI interacts directly with Google services.

### Adding Tasks

You must have a Google Task List set up to use this app.  Tasks must be added via the various apps that Google provides.  Links to those UIs are available in the menu of this app.

## Feature To-do List

* Paging mechanism, or similar, to account for large number of tasks
* Option to hide sub-tasks to reduce clutter
* Enable auto-refresh when data is edited elsewhere
* Tool tips to preview task details (due date, notes, links, etc.)
* Flesh out UI for tighter integration with task creation
* Ability to "send" items to calendar
* Ability to move items between task lists to allow for more context/priority management
* Ability to tag items with cost/complexity and identify items that may not be in the right quadrant
* Enable resorting and save to Google's Task repository
* If API key changes, an invalid credentials error will occur, so log out the user

## Technical To-do List

* Handle error cases, tidy up, and add code comments
* Utilize [Karma](https://karma-runner.github.io) for unit testing
* Utilize [Protractor](http://www.protractortest.org/) for  end-to-end testing