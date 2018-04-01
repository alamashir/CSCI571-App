const express = require('express');
const app = express();
var request = require('request')
const bodyParser = require('body-parser');
var Highcharts = require('highcharts');
var cors = require('cors');
var moment = require('moment');
var fs = require('fs');
//xml2js = require('xml2js');
//var parser = new xml2js.Parser();
var parseString = require('xml2js').parseString;
var http = require('http');

app.use(require('express-promise')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Normal Data
app.get('/1', function(req, res) {
   try{ 
      console.log("request 1"); 
  var symbol = req.query.symbol;

  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey=19CXZPEFGHMDNAHA';
  
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);
        
      //if(json)
      //stock);
      /*if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
    }*/
        
      
        
      var TimeDaily= [];
      TimeDaily=stock["Time Series (Daily)"];
      //"Length: " + JSON.stringify(TimeDaily));
      //var metadataref=stock["Meta Data"]["3. Last Refreshed"];
      var array_keys = Object.keys(TimeDaily);
      
        var data= {};
        
        var value = moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        data["Symbol"] = symbol;
        data["LastPrice"] =TimeDaily[array_keys[0]]["4. close"];
        var change = TimeDaily[array_keys[0]]["4. close"] - TimeDaily[array_keys[1]]["4. close"];
        var change_percent = Math.round(100*change/TimeDaily[array_keys[0]]["4. close"]*100)/100;
        change = Math.round(change*100)/100;
        changDisplay = "";
        if(change>=0){
            changDisplay = "" + change + " (" + change_percent + "%) " + "<img src = 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png' width='12px' height='12px'/>"; 
        }else {
            changDisplay = "" + change + " (" + change_percent + "%) " + "<img src = 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png' width='12px' height='12px'/>"; 
        }
        data["Change"] = changDisplay;
        data["Timestamp"] = moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        data["Open"] = TimeDaily[array_keys[0]]["1. open"];
        data["Close"] = TimeDaily[array_keys[1]]["4. close"];
        data["Range"] = "" + TimeDaily[array_keys[0]]["3. low"] + " - " + TimeDaily[array_keys[0]]["2. high"];
        data["Volume"] = TimeDaily[array_keys[0]]["5. volume"];
        
        responseTable = "<table class = 'table table-striped' table-responsive>";
        responseTable += "<tr><td>";
        responseTable += "Stock Ticker Symbol" + "</td><td>" + symbol;
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Last Price" + "</td><td>" + TimeDaily[array_keys[0]]["4. close"];
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Change (Change Percent)" + "</td><td>" + changDisplay;
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Timestamp" + "</td><td>" + moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Open" + "</td><td>" + TimeDaily[array_keys[0]]["1. open"];
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Close" + "</td><td>" + TimeDaily[array_keys[1]]["4. close"];
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Day's Range" + "</td><td>" + TimeDaily[array_keys[0]]["3. low"] + " - " + TimeDaily[array_keys[0]]["2. high"];
        responseTable += "</td></tr>";
        responseTable += "<tr><td>";
        responseTable += "Volume" + "</td><td>" + TimeDaily[array_keys[0]]["5. volume"];
        responseTable += "</td></tr>";
        responseTable += "</table>";
        
        
        
    console.log("success......1");
      res.json(responseTable); // If my server successfully fetch the data, return it to my front.
    
    }catch(error){
        ///////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get current stock data ", "Message": body})
        console.log("error:1" + body);
    }
  });
  }catch(error){
        ///////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get current stock data ", "Message": body})
        console.log("error:1" + body);
    }
       
});


//PRICE CHART

app.get('/2', function(req, res) {
    
        console.log("request 2"); 
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&outputsize=full&apikey=19CXZPEFGHMDNAHA';
             
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);
      //stock);
      if(stock["Error Message"]){
          res.status(501).json({"error": "Error! Failed to get Price data ", "Message": body})
      //res.json({"error": "invalid symbol"});
      return;
    }
        
    var finalPrice={};
      //stock[]);
      
      var PRICEDaily= [];
      PRICEDaily=stock["Time Series (Daily)"];
      //PRICEWeekly); 
      
        var array_keys = Object.keys(PRICEDaily);
        
        var change = PRICEDaily[array_keys[0]]["4. close"] - PRICEDaily[array_keys[1]]["4. close"];
        console.log(change);
        
        var dates=Object.keys(PRICEDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
       // console.log(datesrev);
        
    
         var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
            //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Time Series (Daily)"][dates[i]]["4. close"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
        
        
        var tempvol=[];
        
        for(var i in dates)
                    {
                       
                         tempvol.push(parseFloat(stock["Time Series (Daily)"][dates[i]]["5. volume"]));
                        
                    }
               //temporary);
            var volum=tempvol.slice(0,130);
            var finalvol=volum.reverse();
            //finalvol);
        
        
        
            finalPrice["finalval"]=finalval;
            finalPrice["finaldate"]=finaldate;
            finalPrice["finalvol"]=finalvol;
            finalPrice["change"]=change;
        
        
            console.log("success......2");
           res.json(finalPrice);
    }catch(error){
        /////////////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get Price data ", "Message": body})
        //console.log("error: 2 " + body);
    }
  })
  
})






//SMA CHART

app.get('/3', function(req, res) {
    console.log("request 3"); 
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=SMA&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=19CXZPEFGHMDNAHA';
  
  request(url, function(err, response, body) {
        
    try{
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
      }
    var finalSMA={};
      //stock[]);
      
      var SMADaily= [];
      SMADaily=stock["Technical Analysis: SMA"];
      //SMADaily); 
      
        
        var dates=Object.keys(SMADaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: SMA"][dates[i]]["SMA"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
            finalSMA["finalval"]=finalval;
            finalSMA["finaldate"]=finaldate;
        
        console.log("success......3");
        res.json(finalSMA);
    }catch(error){
        //////////////////////////////////////////////////////////////
        //console.log("error 3: " + body);
        res.status(501).json({"error": "Error! Failed to get SMA data ", "Message": body})
    }
  })
  
})


//EMA CHART

app.get('/4', function(req, res) {
console.log("request 4");
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=EMA&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=19CXZPEFGHMDNAHA';
             
  request(url, function(err, response, body) {
         
    try{
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
      }
    var finalEMA={};
      //stock[]);
      
      var EMADaily= [];
      EMADaily=stock["Technical Analysis: EMA"];
      //SMADaily); 
      
        
        var dates=Object.keys(EMADaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: EMA"][dates[i]]["EMA"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
            finalEMA["finalval"]=finalval;
            finalEMA["finaldate"]=finaldate;
        
        console.log("success......4");
        res.json(finalEMA);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get EMA data ", "Message": body})
        //////////////////////////////////////////////////////////////////////////////
        console.log("error: 4" + body);
    }
  })
  
})




//STOCH CHART

app.get('/5', function(req, res) {
    
            console.log("request 5"); 

  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=STOCH&symbol='+symbol+'&interval=daily&slowkmatype=1&slowdmatype=1&apikey=19CXZPEFGHMDNAHA';
             
  request(url, function(err, response, body) {
      
    try{
      var stock=JSON.parse(body);
      if(body == "{}"){
          res.status(501).json({"error": "Error! Failed to get STOCH data ", "Message": body});
        //res.json({"error": "invalid symbol"});
      return;
      }
    var finalSTOCH={};
      //stock[]);
      
      var STOCHDaily= [];
      STOCHDaily=stock["Technical Analysis: STOCH"];
      //SMADaily); 
      
        
        var dates=Object.keys(STOCHDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: STOCH"][dates[i]]["SlowK"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
        
        var temp1=[];
        
        for(var j in dates)
                    {
                       
                         temp1.push(parseFloat(stock["Technical Analysis: STOCH"][dates[j]]["SlowD"]));
                        
                    }
               //temporary);
            var value1=temp1.slice(0,130);
            var finalval1=value1.reverse();
            //finalval1);
        
            finalSTOCH["finalval"]=finalval;
            finalSTOCH["finalval1"]=finalval1;
            finalSTOCH["finaldate"]=finaldate;
        
        console.log("success......5");
        res.json(finalSTOCH);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get STOCH data ", "Message": body});
        /////////////////////////////////////////////////////////////////////////////////////
        console.log("error: 5" + body);
    }
  })
  
})

     
 
//RSI CHART


app.get('/6', function(req, res) {
            console.log("request 6"); 

    
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=RSI&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=19CXZPEFGHMDNAHA';
            
  request(url, function(err, response, body) {
      
    try{ 
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
      }
    var finalRSI={};
      //stock[]);
      
      var RSIDaily= [];
      RSIDaily=stock["Technical Analysis: RSI"];
      //SMADaily); 
      
        
        var dates=Object.keys(RSIDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: RSI"][dates[i]]["RSI"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
            finalRSI["finalval"]=finalval;
            finalRSI["finaldate"]=finaldate;
        
        console.log("success......6");
        res.json(finalRSI);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get RSI data ", "Message": body})
        ///////////////////////////////////////////////////////
        console.log("error: 6" + body);
    }
  })
  
})



//ADX CHART


app.get('/7', function(req, res) {
            console.log("request 7"); 

    
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=ADX&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=19CXZPEFGHMDNAHA';
            
  request(url, function(err, response, body) {
    try{ 
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
      }
    var finalADX={};
      //stock[]);
      
      var ADXDaily= [];
      ADXDaily=stock["Technical Analysis: ADX"];
      //SMADaily); 
      
        
        var dates=Object.keys(ADXDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: ADX"][dates[i]]["ADX"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
            finalADX["finalval"]=finalval;
            finalADX["finaldate"]=finaldate;
        
        console.log("success......7");
        res.json(finalADX);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get ADX data ", "Message": body})
        //////////////////////////////////////////////////
        console.log("error: 7" + body);
    }
  })
  
})



//CCI CHART

app.get('/8', function(req, res) {
            console.log("request 8"); 

    
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=CCI&symbol='+symbol+'&interval=daily&time_period=10&series_type=close&apikey=19CXZPEFGHMDNAHA';
            
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
          
        console.log("error: " + body);
      res.json({"error": "invalid symbol"});
      return;
      }
    var finalCCI={};
      //stock[]);
      
      var CCIDaily= [];
      CCIDaily=stock["Technical Analysis: CCI"];
      //SMADaily); 
      
        
        var dates=Object.keys(CCIDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: CCI"][dates[i]]["CCI"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            finalCCI["finalval"]=finalval;
            finalCCI["finaldate"]=finaldate;
        
        console.log("success......8");
        res.json(finalCCI);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get CCI data ", "Message": body})
        ////////////////////////////////////////////////////////////
        console.log("error: 8" + body);
        
    }
  })
  
})



//BBANDS CHART

app.get('/9', function(req, res) {
          console.log("request 9"); 

    
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=BBANDS&symbol='+symbol+'&interval=daily&time_period=5&series_type=close&nbdevup=3&nbdevdn=3&apikey=19CXZPEFGHMDNAHA';
             
  request(url, function(err, response, body) {
    try{
        
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
      }
    var finalBBANDS={};
      //stock[]);
      
      var BBANDSDaily= [];
      BBANDSDaily=stock["Technical Analysis: BBANDS"];
      //SMADaily); 
      
        
        var dates=Object.keys(BBANDSDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: BBANDS"][dates[i]]["Real Upper Band"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
            //finalval);
        
        var temp1=[];
        
        for(var j in dates)
                    {
                       
                         temp1.push(parseFloat(stock["Technical Analysis: BBANDS"][dates[j]]["Real Middle Band"]));
                        
                    }
               //temporary);
            var value1=temp1.slice(0,130);
            var finalval1=value1.reverse();
            //finalval1);
        
        var temp2=[];
        
        for(var k in dates)
                    {
                       
                         temp2.push(parseFloat(stock["Technical Analysis: BBANDS"][dates[k]]["Real Lower Band"]));
                        
                    }
               //temporary);
            var value2=temp2.slice(0,130);
            var finalval2=value2.reverse();
            //finalval2);
    
            finalBBANDS["finalvalhigh"]=finalval;
            finalBBANDS["finalvalmid"]=finalval1;
            finalBBANDS["finalvallow"]=finalval2;
            finalBBANDS["finaldate"]=finaldate;
        
        console.log("success......9");
        res.json(finalBBANDS);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get BBANDS data ", "Message": body})
        //////////////////////////////////////////////////////
        console.log("error: 9" + body);
  }
  })
  
})

  



//MACD CHART

app.get('/10', function(req, res) {
            console.log("request 10"); 

    
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=MACD&symbol='+symbol+'&interval=daily&series_type=close&fastperiod=10&apikey=19CXZPEFGHMDNAHA';
             
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);
      if(stock["Error Message"]){
          res.status(501).json({"error": "Error! Failed to get MACD data ", "Message": body});
      //res.json({"error": "invalid symbol"});
      return;
      }
    var finalMACD={};
      //stock[]);
      
      var MACDDaily= [];
      MACDDaily=stock["Technical Analysis: MACD"];
      //SMADaily); 
      
        
        var dates=Object.keys(MACDDaily);
        var datesrev= dates.slice(0,130);
        datesrev.reverse();
        //datesrev);
        
        var finaldate=[];    
                
                for(var o=0;o<datesrev.length;o++)
                     {
                         var mon=datesrev[o].substr(5,2);
                         var dat=datesrev[o].substr(8,2);
                        finaldate[o]=( mon + "/" + dat  );
                     }
        //finaldate);
      
        var temporary=[];
        
        for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Technical Analysis: MACD"][dates[i]]["MACD_Signal"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,130);
            var finalval=value.reverse();
        
        var temp1=[];
        
        for(var j in dates)
                    {
                       
                         temp1.push(parseFloat(stock["Technical Analysis: MACD"][dates[j]]["MACD"]));
                        
                    }
               //temporary);
            var value1=temp1.slice(0,130);
            var finalval1=value1.reverse();
            //finalval1);
        
        var temp2=[];
        
        for(var k in dates)
                    {
                       
                         temp2.push(parseFloat(stock["Technical Analysis: MACD"][dates[k]]["MACD_Hist"]));
                        
                    }
               //temporary);
            var value2=temp2.slice(0,130);
            var finalval2=value2.reverse();
            //finalval2);
    
            finalMACD["finalvalsig"]=finalval;
            finalMACD["finalvalnorm"]=finalval1;
            finalMACD["finalvalhist"]=finalval2;
            finalMACD["finaldate"]=finaldate;
        
        console.log("success......10");
        res.json(finalMACD);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get MACD data ", "Message": body});
        ////////////////////////////////////////////////////////////////////////////////////
        console.log("error: 10" + body);
    }
  });
  
});


//HIGHSTOCK CHART

app.get('/11', function(req, res) {
            console.log("request 11"); 
try{
    
  var symbol = req.query.symbol;
  
  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&outputsize=full&apikey=19CXZPEFGHMDNAHA';
             
  request(url, function(err, response, body) {
      
    try{ 
      var stock=JSON.parse(body);
      
    var finalhighstock={};
      //stock[]);
      
      var highstock= [];
      highstock=stock["Time Series (Daily)"];
      //SMADaily); 
      
        
        var dates=Object.keys(highstock);
        var datesrev= dates.slice(0,1001);
        datesrev.reverse();
        var resdic=[];
        
        //console.log(datesrev);
       // console.log(datesrev.getTime());
        
        for(var i in datesrev){
            
            var somedate= new Date(datesrev[i]).getTime();
            
            resdic.push([ somedate,parseFloat(stock["Time Series (Daily)"][datesrev[i]]["4. close"])]);
            
        }
        
        //console.log(resdic);
        var temporary=[];
        
       /* for(var i in dates)
                    {
                       
                         temporary.push(parseFloat(stock["Time Series (Daily)"][dates[i]]["4. close"]));
                        
                    }
               //temporary);
            var value=temporary.slice(0,1001);
            var finalval=value.reverse();*/
        
        
    
            /*finalhighstock["finalval"]=finalval;
            //finalhi["finalvalnorm"]=finalval1;
            //finalMACD["finalvalhist"]=finalval2;
            finalhighstock["finaldate"]=datesrev;
        */
        console.log("success......11");
        res.json(resdic);
    }catch(error){
        res.status(501).json({"error": "Error! Failed to get historical charts data. ", "Message": body})
        //////////////////////////////////////////////////////////////////
        console.log("error: 11" + body);
    }
  });
  }catch(error){
        res.status(501).json({"error": "Error! Failed to get historical charts data. ", "Message": body})
        //////////////////////////////////////////////////////////////////
        console.log("error: 11" + body);
    }
    
});


//NEWSFEED

app.get('/12', function(req, res) {
            console.log("request 12"); 

    
  var symbol = req.query.symbol;
  
  var url = 'https://seekingalpha.com/api/sa/combined/'+symbol+'.xml';
  var xml = url;                 
    
    request(url, function(err, response, body) {
       
        parseString(body, function (err, result) {
       
             try{
            if (err) { console.log('error'); }
       
            var news=[];
            var y=result["rss"]["channel"][0]["item"];     
            var article= '/article/';
            
            
            //var q= p["item"];
            
               var q=[];  
                 for(var i in y){
                    var link=y[i]["link"][0];
                     
                     var date=y[i]["pubDate"][0];
                     var dates= date.slice(0,25);
                    
                     if(link.indexOf("/article/")>-1){
                         
                         var ct={};
                         ct["hl"]=link;
                         ct["title"]=y[i]["title"][0];
                         ct["pubdate"]=dates;
                         ct["name"]=y[i]["sa:author_name"][0];
                         
                         news.push(ct);
                         var finalnews= news.slice(0,5);
                         
                         
                     }
                    
                 }
            
                //console.log(q); 
                 
                res.json(finalnews);
            
        }catch(error){
            res.status(501).json({"error": "Error! Failed to get news feed data. ", "Message": body})
            ///////////////////////////////////////////////////////
            console.log("error: 12" + body);
            //res.status(501).json({"Error": "failed ", "Message": body})
        }
    });
 
    });
});


app.get('/13', function(req, res) {
   try{ 
      console.log("request 13"); 
  var symbol = req.query.symbol;

  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey=19CXZPEFGHMDNAHA';
  
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);
        
      //if(json)
      //stock);
      /*if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
    }*/
        
      
        
      var TimeDaily= [];
      TimeDaily=stock["Time Series (Daily)"];
      //"Length: " + JSON.stringify(TimeDaily));
      //var metadataref=stock["Meta Data"]["3. Last Refreshed"];
      var array_keys = Object.keys(TimeDaily);
      
        var data= {};
        
        var value = moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        data["Symbol"] = symbol;
        data["LastPrice"] =TimeDaily[array_keys[0]]["4. close"];
        var change = TimeDaily[array_keys[0]]["4. close"] - TimeDaily[array_keys[1]]["4. close"];
        var change_percent = Math.round(100*change/TimeDaily[array_keys[0]]["4. close"]*100)/100;
        change = Math.round(change*100)/100;
        changDisplay = "";
        if(change>=0){
            changDisplay = "" + change + " (" + change_percent + "%) " + "<img src = 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png' width='12px' height='12px'/>"; 
        }else {
            changDisplay = "" + change + " (" + change_percent + "%) " + "<img src = 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png' width='12px' height='12px'/>"; 
        }
        data["Change"] = changDisplay;
        data["Timestamp"] = moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        data["Open"] = TimeDaily[array_keys[0]]["1. open"];
        data["Close"] = TimeDaily[array_keys[1]]["4. close"];
        data["Range"] = "" + TimeDaily[array_keys[0]]["3. low"] + " - " + TimeDaily[array_keys[0]]["2. high"];
        data["Volume"] = TimeDaily[array_keys[0]]["5. volume"];
        
        var dictionary={};
        dictionary["Symbol"]=symbol;
        dictionary["Stock Price"]=Math.round(TimeDaily[array_keys[0]]["4. close"]*100)/100;
        dictionary["Change"]=change;
        dictionary["ChangePer"] = change_percent;
        dictionary["ChangePercent"]=changDisplay;
        dictionary["Volume"]=Math.round(TimeDaily[array_keys[0]]["5. volume"]);
        
        
        
        
    
        
        
    console.log("success......1");
      res.json(dictionary); // If my server successfully fetch the data, return it to my front.
    
    }catch(error){
        ///////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get current stock data ", "Message": body})
        console.log("error:1" + body);
    }
  });
  }catch(error){
        ///////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get current stock data ", "Message": body})
        console.log("error:1" + body);
    }
       
});


// AUTOCOMPLETE
/*app.get('/14', function(req, res) {
   try{ 
      console.log("request 14"); 
  var symbol = req.query.symbol;

  var url = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=a'+symbol;
  
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);*/
        
      //if(json)
      //stock);
      /*if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
    }*/


app.get('/15', function(req, res) {
   try{ 
      console.log("request 15"); 
  var symbol = req.query.symbol;

  var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&apikey=19CXZPEFGHMDNAHA';
  
  request(url, function(err, response, body) {
    try{
      var stock=JSON.parse(body);
        
      //if(json)
      //stock);
      /*if(stock["Error Message"]){
      res.json({"error": "invalid symbol"});
      return;
    }*/
        
      
        
      var TimeDaily= [];
      TimeDaily=stock["Time Series (Daily)"];
      //"Length: " + JSON.stringify(TimeDaily));
      //var metadataref=stock["Meta Data"]["3. Last Refreshed"];
      var array_keys = Object.keys(TimeDaily);
      
        var data= {};
        
        var value = moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        data["Symbol"] = symbol;
        data["LastPrice"] =TimeDaily[array_keys[0]]["4. close"];
        var change = TimeDaily[array_keys[0]]["4. close"] - TimeDaily[array_keys[1]]["4. close"];
        var change_percent = Math.round(100*change/TimeDaily[array_keys[0]]["4. close"]*100)/100;
        change = Math.round(change*100)/100;
        changDisplay = "";
        if(change>=0){
            changDisplay = "" + change + " (" + change_percent + "%) " + "<img src = 'http://cs-server.usc.edu:45678/hw/hw8/images/Up.png' width='12px' height='12px'/>"; 
        }else {
            changDisplay = "" + change + " (" + change_percent + "%) " + "<img src = 'http://cs-server.usc.edu:45678/hw/hw8/images/Down.png' width='12px' height='12px'/>"; 
        }
        data["Change"] = changDisplay;
        data["Timestamp"] = moment(value).format((' DD MMM  YYYY, hh:mm:ss '));
        data["Open"] = TimeDaily[array_keys[0]]["1. open"];
        data["Close"] = TimeDaily[array_keys[1]]["4. close"];
        data["Range"] = "" + TimeDaily[array_keys[0]]["3. low"] + " - " + TimeDaily[array_keys[0]]["2. high"];
        data["Volume"] = TimeDaily[array_keys[0]]["5. volume"];
        
        
        var dictionary={};
        dictionary["Symbol"]=symbol;
        dictionary["Stock Price"]=Math.round(TimeDaily[array_keys[0]]["4. close"]*100)/100;
        dictionary["Change"]=change;
        dictionary["ChangePer"] = change_percent;
        //dictionary["ChangePercent"]=changDisplay;
        dictionary["Volume"]=Math.round(TimeDaily[array_keys[0]]["5. volume"]);
        dictionary["Open"]=  Math.round(TimeDaily[array_keys[0]]["1. open"]*100)/100;
        dictionary["Close"]= Math.round(TimeDaily[array_keys[1]]["4. close"]*100)/100;
        dictionary["Range"]= "" + Math.round(TimeDaily[array_keys[0]]["3. low"]*100)/100 + " - " + Math.round(TimeDaily[array_keys[0]]["2. high"]*100)/100;
        dictionary["Timestamp"]= value;
        
        
        
    
        
        
    console.log("success......1");
      res.json(dictionary); // If my server successfully fetch the data, return it to my front.
    
    }catch(error){
        ///////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get current stock data ", "Message": body})
        console.log("error:1" + body);
    }
  });
  }catch(error){
        ///////////////////////////////////////////////////////////////////////////
        res.status(501).json({"error": "Error! Failed to get current stock data ", "Message": body})
        console.log("error:1" + body);
    }
       
});










app.listen(8081, function() {
  console.log('Example app listening on port 3001!')
})