const { Builder, Browser } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const edge = require('selenium-webdriver/firefox')
 
let driver = new Builder().forBrowser(Browser.CHROME).usingServer('http://localhost:3000').build()