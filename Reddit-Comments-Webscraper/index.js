const path = require("node:path");
const { Worker } = require("node:worker_threads");

/**
 * IMPORTANT!!!
 * Reddit uses a "feedLength=" query to show how many messages to show!
 * Using the base path "/comments" will only return so many comments, not all of them
 * To get all comments, change the "feedLength" query to return more comments
 * example: https://www.reddit.com/svc/shreddit/profiles/profile_overview-more-posts/new/?after=%3D%3D&t=ALL&name=&feedLength=8"
 */

/** User constant (replace with the user you wish to scrape) */
const user = "x/x/x/x/x/x";

function scrape(user) {
    const worker = new Worker(path.join(__dirname, "/fetcher.js"));
    worker.postMessage(user);

    /** Handle worker messages */
    worker.on("message", (data) => {
        const { err } = data,
            { success } = data;

        if(err) throw new Error("Problem with fetching comments or writing data to file:", err);
        else if(success) console.log("Success in scraping comments");
    });
};

scrape(user);