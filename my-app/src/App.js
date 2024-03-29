import './App.css';
import './index.css'
import * as React from 'react';
import Button from '@mui/material/Button';
// import Field from '@mui/material/Field'
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import AWS from 'aws-sdk';


let searchStr = window.location.search;
let urlParams1 = new URLSearchParams(searchStr);
let code1 = urlParams1.get('code');


const lambda = new AWS.Lambda({
  region: 'us-east-1',
  accessKeyId: 'AKIA6HAOZELRICTE3GPS',
  secretAccessKey: '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'
});

function callLambda(startTime, startDate, finishTime, startMile, finishMile, code1){
  console.log(startTime);
  console.log(startDate);
  const tempDurFinish = finishTime.slice(0,2);
  const tempDurStart = startTime.slice(0,2);
  console.log("temp dur finish is: "+tempDurFinish+"   and temp dur start is: "+tempDurStart);
  let duration = parseInt(tempDurFinish)-parseInt(tempDurStart);
  duration=duration*60;
  console.log("current duration is: "+duration);
  duration = duration + parseInt(finishTime.slice(-2))-parseInt(startTime.slice(-2));
  duration=duration*60;
  console.log(duration);
  console.log(startMile);
  console.log(finishMile);
  const tempTime = startTime.slice(-2);
  const frontTempTime = parseInt(startTime.slice(0,2))+7;
  if (frontTempTime<10){
    startTime="0"+frontTempTime.toString()+":"+tempTime;
  }
  else{
    startTime = frontTempTime.toString() +":"+tempTime;
  }
  console.log("start time post math: "+startTime);
  if(0>startMile){
    startMile=0;
  }
  if(startMile>2660){
    startMile=2660;
  }
  if(0>finishMile){
    finishMile=0;
  }
  if(finishMile>2660){
    finishMile=2660;
  }
  startMile=startMile*2;
  startMile=Math.round(startMile);
  startMile=startMile/2;
  finishMile=finishMile*2;
  finishMile=Math.round(finishMile);
  finishMile=finishMile/2;
  console.log(startMile);
  console.log(finishMile);
  const payload = {
    startTime: startTime,
    startDate: startDate,
    duration: duration,
    startMile: startMile,
    finishMile: finishMile,
    authCode: code1
  };

  const params = {
    FunctionName: 'ParseMap',
    Payload: JSON.stringify(payload)
  };
  

  lambda.invoke(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}


function App() {
  const [startDate, setStartDate] = React.useState("2023-04-01");
  const [startTime, setStartTime] = React.useState("6:00");
  const [finishTime, setFinishTime] = React.useState("10:00");
  const [startMile, setStartMile] = React.useState('0');
  const [finishMile, setFinishMile] = React.useState('0');
  const [show, setShow] = React.useState(true);
  const [approved, setApproved] = React.useState(false);
  const handleChangeStartDate = (event: SelectChangeEvent) => {
    setStartDate(event.target.value);
  };
  const handleChangeStartTime = (event: SelectChangeEvent) => {
    setStartTime(event.target.value);
  };
  const handleChangeFinishTime = (event: SelectChangeEvent) => {
    setFinishTime(event.target.value);
  };
  const handleChangeStartMile = (event: SelectChangeEvent) => {
    const result = event.target.value.replace(/\D/g, '');
    setStartMile(result);
  };
  const handleChangeFinishMile = (event: SelectChangeEvent) => {
    const result = event.target.value.replace(/\D/g, '');
    setFinishMile(result);
  };


  function checkMinMax(event) {
    var value = this.value,
        min = this.getAttribute('min'),
        max = this.getAttribute('max');
    
    if(value < min)
        this.value = min;
    else if(value > max)
        this.value = max;
    }
    
    window.addEventListener('load', function() {
        document.getElementById('yourinput').addEventListener('keyup', checkMinMax);
    });
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimePicker',
          'MobileTimePicker',
          'DatePicker',
          'MobileDatePicker'
        ]}
      >
      <div className="background">
      <h1 className="page-Header">Auto Map</h1>
      <header className="App-header">
        {/* box questionaire for laptops and PC */}
        <box className="boxOutline">
        <Typography sx={{m:"2%", color:"black", fontSize:"80%"}}>Please link to Strava before creating your route!</Typography>
          <Box><Typography sx={{m:"2%" ,color:"black"}}>Click below to connect to strava.</Typography>
          <Button variant="contained" sx={{color:"white"}}href="https://www.strava.com/oauth/authorize?client_id=98457&redirect_uri=http://danielzfinger.github.io/BaconMaps/&response_type=code&scope=read_all,activity:read_all,activity:write">Link to Strava</Button></Box>
          {/* <Button variant="contained" sx={{color:"white"}} href="https://www.strava.com/oauth/authorize?client_id=98457&redirect_uri=http://localhost:3000/BaconMaps/&response_type=code&scope=read_all,activity:read_all,activity:write">Link to Strava</Button></Box> */}
          <Box><Typography sx={{m:"2%" ,color:"black"}}>Linked to Strava?</Typography>
          <Typography sx={{m:"2%" ,color:"black"}}>Awesome! Click here to begin creating your route.</Typography>
          {show&&<Button disabled={code1 != null ? false : true} onClick={()=>{var y=document.getElementsByClassName("timeOutline");for (var i in y) {if (y.hasOwnProperty(i)) {y[i].className = 'show-class';}} var x = document.getElementsByClassName("boxOutline");for (var i in x) {if (x.hasOwnProperty(i)) {x[i].className = 'hidden-class';}}}} variant="contained" sx={{color:"white"}}>Create Route</Button>}</Box>
        </box>
        <box className="timeOutline">
          {show&&<input type="date" defaultValue="2023-08-01" onChange={e=>setStartDate(e.target.value)}/>}
          {show&&<input type="time" defaultValue="06:00:00" onChange={e=>setStartTime(e.target.value)}/>}
          {show&&<input type="time" defaultValue="18:00:00" onChange={e=>setFinishTime(e.target.value)}/>}
          {show&&<TextField id="outlined-basic" label="Start Mile (Range 0-250)" variant="outlined" type="number"  InputProps={{ inputProps: { min: 0, max: 250 } }} value={startMile} onChange={handleChangeStartMile}/>}
          {show&&<TextField id="outlined-basic" label="Finish Mile (Range 0-250)" variant="outlined" type="number" InputProps={{ inputProps: { min: 0, max: 250 } }} value={finishMile} onChange={handleChangeFinishMile}/>}
          {/* {show&&<input id="outlined-basic" label="Finish Mile" variant="outlined" type="number" min="0" max="250" step="1" value={finishMile} onChange={handleChangeFinishMile}/>} */}
          {show &&<Button variant="contained" onClick={()=>{callLambda(startTime, startDate, finishTime, startMile, finishMile, code1);code1=null;setApproved(!approved); setShow(!show); console.log(code1); var x=document.getElementsByClassName("returnHomeOutline");for (var i in x) {if (x.hasOwnProperty(i)) {x[i].className = 'show-class';}} var y = document.getElementsByClassName("timeOutline");for (var i in y) {if (y.hasOwnProperty(i)) {y[i].className = "hidden-class";}}}} >Create File</Button>}
          {!show&&<Typography  sx={{m:"1%" ,color:"black"}}>Activity Uploading! Depending on the size of your activity this could take up to a minute as we contact Strava's servers.</Typography>}
          {!show&&<Button variant="contained" sx={{color:"white"}} href="http://danielzfinger.github.io/BaconMaps">Return Home</Button>}
        </box>
        {/* <box className="returnHomeOutline">
          <Typography  sx={{m:"1%" ,color:"black"}}>Activity Uploading! Depending on the size of your activity this could take up to 5 minutes as we contact Strava's servers.</Typography>
          <Button variant="contained" sx={{color:"white"}} href="http://danielzfinger.github.io/BaconMaps">Return Home</Button>
        </box> */}
      {/* <a href ="https:"className="page-Footer">Contact Us</a> */}
    </header>
    </div>
    </DemoContainer>
    </LocalizationProvider>
    
  );
}

export default App;
