/// <reference types="jest" />

import { FlowClient } from "./FlowClient";
import { Connection } from "mongoose";
//import {WebSocket} from 'ws';

const WebSocket = require('ws')


test('FlowClientConstructor Works', () => {

    WebSocket connection = "ws";
    var clientInfo = 
    { UserId: "123",
      DeviceType: "HoloLens" }
    var client = new FlowClient(clientInfo, connection);
    // Assertion, the client was created and info accurately put in 
    expect(client.DeviceType).toBe("HoloLens");
}, 1000);