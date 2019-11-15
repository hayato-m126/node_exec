const fs = require('fs');
const http = require('http');
const urlParser = require('url');
const qs = require('querystring'); 

const {execSync} = require('child_process');

let server = http.createServer(
    (request, response)=>{
        const url = urlParser.parse(request.url);
        const queryString = qs.parse(url.query);
        const inFile = queryString.inFile;
        const startTime = queryString.startTime;
        const endTime = queryString.endTime;
        let outFile = inFile;
        let bashCommand = "echo filter bag";

        if (startTime !== undefined && endTime !== undefined){
            outFile = "filtered_from_"+ startTime +"_to_" + endTime + inFile
            bashCommand = "rosbag filter " + inFile + " " + outFile + " 't.secs >= " + startTime + " and t.secs <= " + endTime + "'";
        }

        if (startTime !== undefined && endTime === undefined){
            outFile = "filtered_from_"+ startTime + "_" + inFile
            bashCommand = "rosbag filter " + inFile + " " + outFile + " 't.secs >= " + startTime + "'";
        }

        if (startTime === undefined && endTime !== undefined){
            outFile = "filtered_to_"+ endTime + "_" + inFile
            bashCommand = "rosbag filter " + inFile + " " + outFile + " 't.secs <= " + endTime + "'";
        }

        execSync(bashCommand);
        console.log("finished filterring");

        const raw = fs.createReadStream( outFile );
        const resHeader = {
            'Content-Type' : 'application/rosbag',
            'Content-Disposition' : 'attachment; filename='+ outFile
        };
        response.writeHead(200, resHeader );
        raw.pipe(response);
        console.log("ファイル配信しました。");
    }
);
server.listen(3000);