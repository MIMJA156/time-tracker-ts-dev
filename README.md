# Improving Server/UI

As I was working on the main branch I realized that updating the page with new data would have been painful. I decided to begin using WebSockets to make my life better and so in this branch I am adding support for just that.

This VS Code extension tracks the amount of time you spend coding.

## Progress

>Note: I am still in highschool so this project may take awhile! I am trying to make everything as professinal and high quality as I can!

#### Not Done

This extension is still in development so it is not currently available to install!
If you are looking for a time tracking extension take a look at the [Original Version](https://github.com/MIMJA156/time-tracker) of this extension!

## Installation

Simply download the extension from the marketplace and enjoy!

## Usage

There are a few main features to consider:
- Cloud Storage for global time using gist's
- web GUI
- Basic Settings

#### Cloud Storage

To use this feature you need to link your GitHub account and allow gist read and write access. To do this run the command VS Code command ``Time Tracker: Link GitHub`` or access it inside the options window on the web GUI.

#### Web GUI

To open the Web GUI click on the time badge or run the VS Code command ``Time Tracker: Open Web GUI``
This will open a new tab in the browser and display the GUI.

#### Basic Settings

There are a few basic settings you can configure at the moment in VS Code,
- Badge Priority
- Badge Position
- Badge Icon