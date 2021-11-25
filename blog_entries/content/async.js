const fs = require("fs");
const util = require("util");

async function main(){
    const start = Date.now();
    const file1 = fs.readFileSync("test.txt");
    const file2 = fs.readFileSync("test2.txt");
    const end = Date.now();
    console.log("start: " + start);
    console.log("end: " + end);
    
    console.log("-------------------------");
    
    const readFile = util.promisify(fs.readFile);
    const start2 = Date.now();
    const f1 = await readFile("test.txt");
    const f2 = await readFile("test2.txt");
    const end2 = Date.now();
    console.log("start: " + start2);
    console.log("end: " + end2);
    
    console.log("-------------------------");
    // gathering up the results of a bunch of async tasks
    // I think highlights a use case for needing async functionality,
    // even though a lot of examples out there demo async/await
    // in a synchronous process (e.g. just await on one thing)
    // in this way we allow the reading of multiple files to
    // happen asynchronously (so concurrently, but not parallel), 
    // which should allow a performance advantage
    // over synchronously (especially with a large enough numbers of files)
    const start3 = Date.now();
    const res = await Promise.all([readFile("test.txt"), readFile("test2.txt")]);
    const end3 = Date.now();
    //console.log(res);
    console.log("start: " + start3);
    console.log("end: " + end3);
}

main();