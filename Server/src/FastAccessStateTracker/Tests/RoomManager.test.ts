import { RoomManager } from "../RoomManager"
import { Room } from "../Room"

import { FlowUser } from "../FlowLibrary/FlowUser"
import { FlowProject } from "../FlowLibrary/FlowProject"
import TypeORMDatabase from "../Database/TypeORMDatabase"

const databaseUserCreationMock = jest.fn()
jest.mock('../Database/TypeORMDatabase')


describe("RoomManager,", () => {
    it("can create rooms", async() => {
        const projectID = "1234";
        
        const TypeORMGetProjectMock = jest.fn(async (projectID: string) => {return new FlowProject({})})

        TypeORMDatabase.GetProject = TypeORMGetProjectMock
        
        expect(RoomManager._RoomCount).toBe(0);

        //act
        RoomManager.CreateRoom(projectID);

        //assert 
        expect(TypeORMGetProjectMock).toHaveBeenCalledWith(projectID);
        expect(RoomManager._RoomCount).toBe(1);
    })

    it("can find rooms", async() => {
        const projectID = "1234";
        
        const TypeORMGetProjectMock = jest.fn(async (projectID: string) => {return new FlowProject({})})

        TypeORMDatabase.GetProject = TypeORMGetProjectMock
        
        // act
        RoomManager.CreateRoom(projectID);

        let room = RoomManager.FindRoom(projectID);

        //assert
        expect(room.GetRoomCode()).toBe("1234");

    })

    it("can destroy rooms", async () => {
        const projectID = "1234";
        
        const TypeORMGetProjectMock = jest.fn(async (projectID: string) => {return new FlowProject({})})

        TypeORMDatabase.GetProject = TypeORMGetProjectMock
        
        //act
        RoomManager._RoomList = [];
        RoomManager._RoomCount = 0;
        RoomManager.CreateRoom(projectID);
        
        // assert 
        expect(RoomManager.FindRoom(projectID)).toBeTruthy()

        // act
        let count = RoomManager._RoomCount;
        RoomManager.DestroyRoom(projectID);

        //assert
        expect(RoomManager._RoomCount).toBe((count-1));
        expect(RoomManager.FindRoom(projectID)).toBeFalsy()


    })

})



