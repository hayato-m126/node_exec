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
        const topics = queryString.topics.split(','); //,区切りで複数個渡す
        let outFile = "filtered_" + inFile;
        let bashCommand = "rosbag filter " + inFile + " " + outFile + " '";

        if(topics !== undefined){
            for(var i=0; i<topics.length; i++){
                bashCommand += "topic == \"" + topics[i] + "\" ";
                if(i!=topics.length-1){
                    bashCommand += "or ";
                }
            }
            if (startTime === undefined && endTime === undefined){
                bashCommand += "'";
            }else{
                bashCommand += "and ";
            }
        }

        if (startTime !== undefined && endTime !== undefined){
            bashCommand += "t.secs >= " + startTime + " and t.secs <= " + endTime + "'";
        }

        if (startTime !== undefined && endTime === undefined){
            bashCommand += "t.secs >= " + startTime + "'";
        }

        if (startTime === undefined && endTime !== undefined){
            bashCommand += "t.secs <= " + endTime + "'";
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