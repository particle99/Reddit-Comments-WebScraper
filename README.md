# Reddit-Comments-WebScraper
A webscraper for reddit that scrapes a users comments 

# How it works
This script works by utilizing the **node-fetch** npm package to send an https request to the reddit website and scrape the plain HTML text. It then posts the raw HTML text through a worker to *comment_parser.js* where it converts the raw HTML text to a DOM object through the use of the **JSDOM** npm package. The code then finds the comment element and scrapes the text content where it is converted to JSON format and pasted to *comments.json*

# Prerequisites
You must have the node-fetch npm package installed with version x2
Download by running *npm i node-fetch@2.0* in the terminal

# License  
