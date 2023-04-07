import './App.css';
import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
let code1 = urlParams1.get('code')

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
  if(startMile>2650){
    startMile=2650;
  }
  if(0>finishMile){
    finishMile=0;
  }
  if(finishMile>2650){
    finishMile=2650;
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
    setStartMile(event.target.value);
  };
  const handleChangeFinishMile = (event: SelectChangeEvent) => {
    setFinishMile(event.target.value);
  };

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
    <div className="App">
      <header className="App-header">
        <Typography sx={{m:"1%" ,color:"orange"}}>Link to Strava before creating your activity!</Typography>
      <Button variant="contained" sx={{color:"orange"}}href="https://www.strava.com/oauth/authorize?client_id=98457&redirect_uri=http://danielzfinger.github.io/BaconMaps/&response_type=code&scope=read_all,activity:read_all,activity:write">Connect to Strava</Button>
      <Box sx={{ minWidth: 120 }} >
        <label>Activity Date</label>
        <input type="date" value="2023-01-01" onChange={e=>setStartDate(e.target.value)}/>
        <label>Start Time</label>
        <input type="time" value="06:00:00" onChange={e=>setStartTime(e.target.value)}/>
        <label>Finish Time</label>
        <input type="time" value="18:00:00" onChange={e=>setFinishTime(e.target.value)}/>
        <TextField id="outlined-basic" label="Start Mile" variant="outlined" type="number" min="0" value={startMile} onChange={handleChangeStartMile}/>
        <TextField id="outlined-basic" label="Finish Mile" variant="outlined" type="number" value={finishMile} onChange={handleChangeFinishMile}/>
      </Box>
    <Button disabled={code1 != null ? false : true} variant="contained" onClick={() => {callLambda(startTime, startDate, finishTime, startMile, finishMile, code1); console.log(code1)}} >Create File</Button>
    </header>
    </div>
    </DemoContainer>
    </LocalizationProvider>
  );
}

export default App;