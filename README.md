# Declutter Web Application

[![Build Status](https://travis-ci.org/chillu/declutter.svg)](https://travis-ci.org/chillu/declutter)

## Installation

 * Install [node](http://nodejs.org) through its installer
 * Install homebrew deps: `brew install imagemagick librsvg`
 * Install phonegap: `sudo npm install -g phonegap`
 * Install gem deps: `sudo gem install sass`
 * Install node deps: `npm install`
 * Install bower deps: `bower install`

## Usage

 * Build the project: `gulp build`
 * Run a local webserver: `gulp watch`
 * Compile phonegap packages: `phonegap build`
 * Compile icons: `gulp icons`

## Testing

 * Install deps: `npm install -g karma-cli && npm install -g protractor`
 * Install and start Selenium: `webdriver-manager update && webdriver-manager start`
 * Run unit tests (through [Karma](https://karma-runner.github.io/)): `karma start test/karma.conf.js`
 * Run integration tests (through [Protractor](https://github.com/angular/protractor)): `protractor test/protractor.conf.js`

## License

	Copyright (C) 2013-2015 Ingo Schommer

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.