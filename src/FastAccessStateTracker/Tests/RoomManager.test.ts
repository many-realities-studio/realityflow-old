import { RoomManager } from "../RoomManager"
import { Room } from "../Room"

import { FlowUser } from "../FlowLibrary/FlowUser"
import { FlowProject } from "../FlowLibrary/FlowProject"
import MongooseDatabase from "../Database/MongooseDatabase"

const databaseUserCreationMock = jest.fn()
jest.mock('../Database/MongooseDatabase')


describe("RoomManager,", () => {
    it("can create rooms", async() => {
        const projectID = "1234";
        
        const mongooseGetProjectMock = jest.fn(async (projectID: string) => {return new FlowProject({})})

        MongooseDatabase.GetProject = mongooseGetProjectMock
        
        //act
        RoomManager.CreateRoom(projectID);

        //assert 
        expect(mongooseGetProjectMock).toHaveBeenCalledWith(projectID);
        expect(RoomManager._RoomCount).toBe(1);
    })

    it("can find rooms", async() => {
        const projectID = "1234";
        
        const mongooseGetProjectMock = jest.fn(async (projectID: string) => {return new FlowProject({})})

        MongooseDatabase.GetProject = mongooseGetProjectMock
        
        // act
        RoomManager.CreateRoom(projectID);

        let room = RoomManager.FindRoom(projectID);

        //assert
        expect(room.GetRoomCode()).toBe("1234");

    })

    it("can destroy rooms", async() => {
        const projectID = "1234";
        
        const mongooseGetProjectMock = jest.fn(async (projectID: string) => {return new FlowProject({})})

        MongooseDatabase.GetProject = mongooseGetProjectMock
        
        //act
        RoomManager._RoomList = [];
        RoomManager._RoomCount = 0;
        RoomManager.CreateRoom(projectID);
        let count = RoomManager._RoomCount;
        RoomManager.DestroyRoom(projectID);

        //assert
        expect(RoomManager._RoomCount).toBe((count-1));


    })

})



