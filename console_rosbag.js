const exec = require('child_process').exec;
exec('rosbag filter 2011-01-19-07-49-38.bag filter.bag "t.secs <= 1295452260"', (err, stdout, stderr) => {
  if (err) { console.log(err); }
  console.log(stdout);
});
