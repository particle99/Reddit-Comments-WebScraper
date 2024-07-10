const { parentPort: thread } = require("node:worker_threads"), 
    { JSDOM, VirtualConsole } = require("jsdom");

const fs = require("fs"),
    path = require("path");

const comments = JSON.parse(fs.readFileSync(path.join(__dirname, "/comments.json")));

thread.on("message", (rawData) => {
    /** Temp hotfix to stop CSS stylesheet parsing errors */
    const virtualConsole = new VirtualConsole(),
        dom = new JSDOM(`${rawData}`, { virtualConsole });

    /** Grab comments element bodies from the DOM */
    dom.window.document.querySelectorAll("#-post-rtjson-content").forEach(elem => {
        const comment = elem.textContent,
            archiveIndex = comments.findIndex(elem => elem.comment == comment);
        
        /** If the comment already exists in the archive, don't push */
        if(archiveIndex < 0) comments.push({ comment: comment });
    });

    /** If a comments.json file does not exsist, create a new file and write the content to the new file */
    if(!fs.existsSync(path.join(__dirname, "/comments.json"))) {
        const writeStream = fs.createWriteStream("comments.json");
        writeStream.write(JSON.stringify(comments, undefined, 4), (err, success) => {
            if(err) thread.postMessage({ error: error });
            else if(success) thread.postMessage({ success: success });
        });
    } else if(fs.existsSync(path.join(__dirname, "/comments.json"))) {
        fs.writeFileSync(path.join(__dirname, "/comments.json"), JSON.stringify(comments, undefined, 4));
        thread.postMessage({ success: true });
    };
});