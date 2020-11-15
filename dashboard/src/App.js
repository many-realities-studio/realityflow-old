import './App.css';
import { useState, useEffect } from 'react'

function App() {
  //const [myText, setMyText] = useState()
  const [ws, setWs] = useState()
  const [log, setLog] = useState([])
  //const authToken = btoa("God:Jesus");

  /*function sendMessageToServer() {
    ws.send("Hello from button!");
  }*/
  useEffect(() => {
    console.log("Using effect")
    var authToken = btoa("God:Jesus");

    document.cookie = 'Basic ' + authToken + '; path=/';

    let ws = new WebSocket('ws://localhost:8999/')
    /*let ws = new WebSocket('ws://localhost:8999/', {
      headers: {
        Authorization: `Basic ${encodedUserData}`,
      },
    });*/
    console.log(ws)
    console.log(document.cookie)
    ws.onopen = () => {
      console.log("connected")
      //ws.send("Hello from the client!");
    }
    ws.onmessage = evt => {
      console.log("Server sent me this: " + evt.data)
      let newObj = JSON.parse(evt.data.toString());
      console.log(newObj)
      setLog((prevLog) => [...prevLog, newObj])
    }
    setWs(ws)
  }, [])
  /*useEffect(() => {
    const getData = async () => {
      let result = await fetch("http://localhost:8999/data").then(value => value.text())
      console.log(result)
      setMyText(result)
      }
    getData()
  }, [])*/
  let logEntries = log.map((item) => <p>{item.data}</p>)
  return (
    <div className="App">
        {logEntries}
    </div>
  );
}

export default App;
