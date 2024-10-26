# Roadmap

## Phase 1: Initial Setup

1. **Project Initialization**

   - Set up a new React and Electron project using `electron-react-boilerplate` or `create-react-app` combined with Electron.
   - Configure basic Electron settings (main process, renderer process, packaging).
   - Set up `electron-store` for persistent storage of user data (settings, tasks, suggestions).

2. **Install Dependencies**

   - Install necessary libraries: `react`, `react-dom`, `electron`, `electron-store`, `node-schedule`, `react-js-cron`, `yuhonas/free-exercise-db`, and any other required packages (e.g., `@electron/remote` for managing Electron processes).

3. **Basic App Layout**
   - Create a basic layout with a main window showing a dashboard for task management and settings.
   - Implement a menu bar for navigation between different sections (e.g., Tasks, Settings, Suggestions).
   - Add a system tray icon for background mode.

## Phase 2: Notification System

1. **Scheduled Notifications**

   - Implement a scheduling system using `node-schedule` to trigger notifications at user-defined times.
   - Integrate `react-js-cron` for a user-friendly scheduling UI.
   - Allow users to add, edit, enable/disable, and delete scheduled tasks.

2. **Activity Detection (Unproductiveness)**

   - Research methods for detecting unproductive behavior (e.g., idle system time using `electron-idle`).
   - Create logic to trigger notifications if the user is idle beyond a defined threshold.
   - Make detection settings configurable (e.g., sensitivity, timeout).

3. **Notification Click Handling**
   - Configure notifications to be clickable, opening a suggestion view.
   - Ensure notifications support both scheduled and unproductiveness-triggered scenarios.

## Phase 3: Suggestions Management

1. **Fetching Suggestions**

   - Integrate `yuhonas/free-exercise-db` for exercise suggestions.
   - Implement filters for users to customize suggestions (e.g., type, duration).

2. **Custom Suggestions**

   - Create a form for users to add custom suggestions.
   - Validate custom suggestions against a defined schema before saving to `electron-store`.

3. **Disliked Suggestions**
   - Add functionality to mark suggestions as disliked and prevent them from being shown again.
   - Create a view to manage disliked suggestions, allowing users to "undislike" suggestions.

## Phase 4: Task Management

1. **Task CRUD Operations**

   - Implement interfaces for creating, reading, updating, and deleting tasks.
   - Add a toggle to enable/disable tasks.
   - Use `electron-store` for storing task data persistently.

2. **Task List UI**
   - Design a user interface that displays tasks in a list or calendar format.
   - Include options to quickly edit or delete tasks.

## Phase 5: Settings and Preferences

1. **Background Running Settings**

   - Implement settings for minimizing to the system tray.
   - Add an option to start the app on system startup (using `electron-settings` or a similar package).
   - Optionally, start minimized and send a notification to inform the user that the app is running in the background.

2. **Single Instance Lock**

   - Use Electron’s `app.requestSingleInstanceLock` to prevent multiple instances of the app from running.

3. **Notification Silence**

   - Implement a setting to silence notifications for a specified period (e.g., 30 minutes, 1 hour).
   - Use `node-schedule` or a timeout to automatically re-enable notifications after the selected period.

4. **Quit Functionality**
   - Add an option in the system tray menu to completely quit the app if running in the background.

## Phase 6: Polishing and Testing

1. **Testing for Edge Cases**

   - Test all scheduling and notification scenarios (e.g., overlapping schedules, simultaneous triggers).
   - Ensure the app handles minimizing, background running, and quitting correctly.

2. **User Experience Enhancements**

   - Add animations or transitions for a smoother user interface.
   - Provide helpful tooltips or user guidance where needed.

3. **Performance Optimization**
   - Optimize the Electron app's memory and CPU usage, especially for background running.
   - Bundle the app using `electron-builder` or `electron-packager` for distribution.

## Phase 7: Deployment and Distribution

1. **Packaging**

   - Set up Electron packaging for Windows, macOS, and Linux.
   - Test installations on different platforms to ensure smooth installation and startup.

2. **Auto-Update Functionality (Optional)**

   - Integrate an auto-update feature using `electron-updater` to keep the app up-to-date.

3. **Release and Feedback Collection**
   - Publish the app on your desired platforms.
   - Collect user feedback and iterate on features based on user needs.
