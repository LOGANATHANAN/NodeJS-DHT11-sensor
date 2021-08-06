require('dotenv').config();
var sensor = require("node-dht-sensor");
const mongoose=require('mongoose');
const db=process.env.db;

const connect = mongoose
.connect(db, { useFindAndModify: false,useUnifiedTopology:true,useNewUrlParser:true })
.then(() => {
    console.log("Mondo db connected....");
})
.catch((err) => console.log(err));

const THSchema = new mongoose.Schema({
    time:{
        type:String,
        required:true
    },
    temperature:{
        type:String,
        required:true
    },
    humidity:{
        type:String,
        required:true
    }
});

const TH=mongoose.model('TH',THSchema);

setInterval(read,60000);

function read(){

sensor.read(11, 4, function(err, temperature, humidity) {
  if (!err) {
      var d=new Date();
    var th=new TH({
        time:d,
        temperature:temperature,
        humidity:humidity
    });
    th.save(function(err,res){
        if(err){
            console.log("Error pushing data to DB");
        }
        else{
            console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
        }
    });
  }
else{
    console.log("Error in reading data from sensor");
}
});

}

