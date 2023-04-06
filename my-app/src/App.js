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
  const [startDate, setStartDate] = React.useState();
  const [startTime, setStartTime] = React.useState();
  const [finishTime, setFinishTime] = React.useState();
  const [startMile, setStartMile] = React.useState('');
  const [finishMile, setFinishMile] = React.useState('');
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
      <Box sx={{ minWidth: 120 }}>
        <input type="date" onChange={e=>setStartDate(e.target.value)}/>
        <input type="time" onChange={e=>setStartTime(e.target.value)}/>
        <input type="time" onChange={e=>setFinishTime(e.target.value)}/>



      {/* <TextField id="outlined-basic" value={day} onChange={handleChangeDay} label="Day" variant="outlined" />
      <FormControl fullWidth>
        <InputLabel variant="contained" id="demo-simple-select-label">Start Time</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={startTime}
          label="StartTime"
          onChange={handleChangeStartTime}
        >
          <MenuItem value={"13"}>1:00</MenuItem>
          <MenuItem value={"14"}>1:15</MenuItem>
          <MenuItem value={"15"}>1:30</MenuItem>
          <MenuItem value={"16"}>1:45</MenuItem>
        </Select>
      </FormControl>
      <TextField id="outlined-basic" value={activityDurationHour} onChange={handleChangeActivityDurationHour} label="Hour" variant="outlined" />
      <TextField id="outlined-basic" value={activityDurationMinute} onChange={handleChangeActivityDurationMinute} label="Minute" variant="outlined" /> */}
      {/* startmile */}
      <FormControl fullWidth>
        <InputLabel variant="contained" id="demo-simple-select-label">StartMile</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={startMile}
          label="StartMile"
          onChange={handleChangeStartMile}
        >
          <MenuItem value={"0"}>0</MenuItem>
          <MenuItem value={"1"}>1</MenuItem>
          <MenuItem value={"2"}>2</MenuItem>
          <MenuItem value={"3"}>3</MenuItem>
          <MenuItem value={"4"}>4</MenuItem>
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"6"}>6</MenuItem>
          <MenuItem value={"7"}>7</MenuItem>
          <MenuItem value={"8"}>8</MenuItem>
          <MenuItem value={"9"}>9</MenuItem>
        </Select>
      </FormControl>
      {/* finish mile */}
      <FormControl fullWidth>
        <InputLabel variant="contained" id="demo-simple-select-label">Finish Mile</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={finishMile}
          label="FinishMile"
          onChange={handleChangeFinishMile}
        >
          <MenuItem value={"1"}>1</MenuItem>
          <MenuItem value={"2"}>2</MenuItem>
          <MenuItem value={"3"}>3</MenuItem>
          <MenuItem value={"4"}>4</MenuItem>
          <MenuItem value={"5"}>5</MenuItem>
          <MenuItem value={"6"}>6</MenuItem>
          <MenuItem value={"7"}>7</MenuItem>
          <MenuItem value={"8"}>8</MenuItem>
          <MenuItem value={"9"}>9</MenuItem>
          <MenuItem value={"28"}>28</MenuItem><MenuItem value={"29"}>29</MenuItem><MenuItem value={"30"}>30</MenuItem><MenuItem value={"31"}>31</MenuItem><MenuItem value={"101"}>101</MenuItem>
        </Select>
      </FormControl>
    </Box>
    <Button variant="contained" href="https://www.strava.com/oauth/authorize?client_id=98457&redirect_uri=http://localhost:3000/StravaAutoMap/&response_type=code&scope=read_all,activity:read_all,activity:write">Connect to Strava</Button>
    <Button disabled={code1 != null ? false : true} variant="contained" onClick={() => {callLambda(startTime, startDate, finishTime, startMile, finishMile, code1); console.log(code1)}} >Create File</Button>
    </header>
    </div>
    </DemoContainer>
    </LocalizationProvider>
  );
}

export default App;
