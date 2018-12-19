var readline = require('readline');
var spawn = require("child_process").spawn
var colors = require('colors');
var fs = require('fs');
var ytdl = require('ytdl-core');
var state = [];
const downloads = "./Downloads"
const ffmpeg   = require('fluent-ffmpeg');
class Rand {
  constructor(){
    this.num = Math.floor(Math.random() * 99999999999)
    return this
  }
}
const audio = `${__dirname}/Downloads/${new Rand().num}.mp3`
const main = `Downloads/${new Rand().num}.mp4`

var rl = readline.createInterface(process.stdin,process.stdout, null);
rl.question(`Audio or Video?\n`.white.bgCyan.bold, (resp) =>{
  if (!fs.existsSync(downloads)){
    fs.mkdirSync(downloads);
  } 

rl.question('Please enter the link to the youtube video\n'.white.bgCyan.bold, (link) => {
  if (!ytdl.validateURL(link)) { rl.close();
    console.log("Please provide a valid link".red)
    return }

    if (resp == "video") {
     // var video = ytdl(link,{filter: (format) =>  format.container === "mp4", quality: "highest"});
     console.log('Video Download started'.yellow.bold);
    ytdl(link, { filter: format => {
      
      return format.container === 'm4a' && !format.encoding; } })
      // Write audio to file since ffmpeg supports only one input stream.
      
      .pipe(fs.createWriteStream(audio))
      .on('finish', () => {
        ffmpeg()
          .input(ytdl(link, { filter: format => {
            return format.container === 'mp4' && !format.audioEncoding; } }))
          .videoCodec('copy')
          .input(audio)
          .audioCodec('copy')
          .save(main)
          .on('error', console.error)
          .inputFPS(29) // to make the download a bit faster (change if you want)
          .inputOptions("-r 29")
          .on('progress', progress => {
            process.stdout.cursorTo(0);
           process.stdout.clearLine(1);
            process.stdout.write(`${progress.targetSize}kb downloaded`.inverse);
          }).on('end', () => {
            fs.unlink(audio, err => {
              if(err) console.error(err);
              else console.log('\nVideo Download Finished'.green.bold);
            });
          });
      });


    } else if (resp=="video-low") {

      let vidID = ytdl.getVideoID(link)
  
      
        var video = ytdl(link,{filter: (format) =>  format.container === "mp4", quality: "highest"});
        
      console.log('Video Download started'.yellow.bold);
    /* Errors in special chars  
    ytdl.getInfo(vidID, (err, info) => {
        if (err) throw err; 
         }) */
        
        video.pipe(fs.createWriteStream(`Downloads/${new Rand().num}.mp4`));
        
      
      video.on('end', function() {
        console.log('Video Download Finished'.green.bold);
      });

    } else {
      var video = ytdl(link, {
        quality: 'highestaudio',//filter: 'audioonly',
      });
      console.log('Audio Download started'.yellow.bold);
      ffmpeg(video)
      .audioBitrate(128)
      .save(`${__dirname}/Downloads/${new Rand().num}.mp3`)
      
      .on('progress', (p) => {
        
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`${p.targetSize}kb downloaded`.inverse);
      })
      .on('end', ()=>{
        console.log('\nAudio Download Finished'.green.bold)
      })
    }
 
  rl.close();
})
});
