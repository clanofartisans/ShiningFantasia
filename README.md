# Shining Fantasia

[Documentation](https://gitlab.com/Velyn/ShiningFantasia/-/wikis/home) (no longer exists)

* [Localized Resources](https://docs.google.com/spreadsheets/d/e/2PACX-1vSEQyA73G9Lq5ZG_IwW0kP6t3TkMtV7RZqyWkGp82gS5tgTGstzQUpueKHIChzoAkl4acwoEWA7CIXl/pubhtml)
* [Item Format](https://docs.google.com/spreadsheets/d/e/2PACX-1vQCnOdHlPKCl9w5jZc35ukG6qgbFxQZhK6Slkmz49iJxZ_ithtVTm4c1xWb4NdBRbxd8ddZtuod1e1-/pubhtml)

-----

## Installation and Setup
1. Install Node.js. You can grab the latest LTS release (recommended) from https://nodejs.org/
2. Clone the Shining Fantasia repository using something like `git clone https://gitlab.com/Velyn/ShiningFantasia.git`
3. In a command prompt or PowerShell, go to where you cloned the repo and run `npm install`
4. To build the "main" application, run `npm run dist` and an executable file should be generated in the `./dist` directory and the commands will be generated in `./build/commands/*`

## Running Commands
Commands like "item2json" can be run like `node ./build/commands/item2json`

### Building Command Executables
1. To build a command into an executable, you need to install "pkg" like `npm i pkg -g` which will install it globally to your machine.
2. Once installed, you can compile an individual command like: `pkg ./build/commands/item2json/index.js -o item2json`

### Example Usage
First, you'll need to find the DAT you want to edit. Let's say we want to edit the level 80 "Mandau" and turn it into an "Onion Greataxe". See "Helpful Resources" below for help tracking it down but, for now, we know this is item number 18271, the Japanese DAT file is `ROM\0\6.DAT` and the English DAT file is `ROM\118\108.DAT`. Assuming we have built an executable, we can convert our DAT files to JSON by running the following:

`item2json "X:\Path\To\Game\SquareEnix\FINAL FANTASY XI\ROM\0\6.dat" "X:\Path\To\Game\SquareEnix\FINAL FANTASY XI\ROM\118\108.dat" mydata.json`

Now, we can find item number 18271 in the newly created `mydata.json` file and edit it in a text editor or some other tool. Save your changes and then we'll basically run the command in reverse using `json2item` by running the following:

`json2item mydata.json "X:\Path\To\Game\SquareEnix\FINAL FANTASY XI\ROM\0\6.dat" "X:\Path\To\Game\SquareEnix\FINAL FANTASY XI\ROM\118\108.dat"`

## Helpful Resources
Finding the DAT files you're looking for can be tricky but there are several tools to help you.
1. The main Shining Fantasia application can be used to browse DAT files in your client installation and provides a preview of information.
2. The "Localized Resources" spreadsheet, found at: https://docs.google.com/spreadsheets/d/e/2PACX-1vSEQyA73G9Lq5ZG_IwW0kP6t3TkMtV7RZqyWkGp82gS5tgTGstzQUpueKHIChzoAkl4acwoEWA7CIXl/pubhtml
3. The "Item Format" spreadsheet, found at: https://docs.google.com/spreadsheets/d/e/2PACX-1vQCnOdHlPKCl9w5jZc35ukG6qgbFxQZhK6Slkmz49iJxZ_ithtVTm4c1xWb4NdBRbxd8ddZtuod1e1-/pubhtml
4. The item indices on FFXIclopedia, found at: https://ffxiclopedia.fandom.com/wiki/Category:Item_Index
