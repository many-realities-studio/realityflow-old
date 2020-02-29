import { StateTracker } from "../StateTracker"

import { FlowUser } from "../FlowLibrary/FlowUser"
import MongooseDatabase from "../Database/MongooseDatabase"
import { RoomManager } from "../RoomManager"
import { FlowProject } from "../FlowLibrary/FlowProject"

const databaseUserCreationMock = jest.fn()

let roomManager : Map<string, Map<string, Array<string> > >

jest.mock('../Database/MongooseDatabase')
jest.mock('../RoomManager')

const fakeJoinRoom = jest.fn(async(roomCode: string, username:string, client: string) => {})
RoomManager.JoinRoom = fakeJoinRoom 

const fakeLeaveRoom = jest.fn(async(roomCode: string, username:string, client: string) => {})
RoomManager.LeaveRoom = fakeLeaveRoom 

const fakeDestroyRoom = jest.fn((roomCode:string) => new Map<string, Array<string>>())
RoomManager.DestroyRoom = fakeDestroyRoom

const fakeAuthentication = jest.fn(async (username:string, password:string) => true)
MongooseDatabase.AuthenticateUser = fakeAuthentication

const mongooseProjectDeleteMock = jest.fn(async (projectToDelete: string) => {})
MongooseDatabase.DeleteProject = mongooseProjectDeleteMock

const mongooseUserDeleteMock = jest.fn(async (userToDelete: string) => {})
MongooseDatabase.DeleteUser = mongooseUserDeleteMock

const mongooseProjectCreateMock = jest.fn( async (projectToCreate: FlowProject) => {} )  
MongooseDatabase.CreateProject = mongooseProjectCreateMock

describe("User", () => {
    it("can be created", async () => {
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        }
        
        const mongooseUserCreateMock = jest.fn(async (userName:string, Password: string) => {}) 

        MongooseDatabase.CreateUser = mongooseUserCreateMock

        //act
        await StateTracker.CreateUser(testUser.Username, testUser.Password)

        //assert
        expect(mongooseUserCreateMock).toHaveBeenCalledWith(testUser.Username, testUser.Password)
    });

    it("can be deleted", async () =>{
        // arrange
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        }       
        // act
        await StateTracker.DeleteUser(testUser.Username, testUser.Password)
        
        // assert
        expect(mongooseUserDeleteMock).toHaveBeenCalledWith(testUser.Username)
    });

    it("can be logged in", async () => {
        // arrange
        const testUser = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient"
        }

        // act
        await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)

        // assert
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
        expect(fakeJoinRoom).lastCalledWith("noRoom", testUser.Username, testUser.Client)
        expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
        expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom")
    });

    it("can be logged out", async ()=>{
        // arrange
        const testUser = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient"
        }

        const testUser2 = {
            Username: "yash",
            Password: "yashsPassword2",
            Client: "yashsClient2"
        }

        // act
        await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)
        await StateTracker.LoginUser(testUser2.Username, testUser2.Password, testUser2.Client)

        // assert
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
        expect(fakeJoinRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
        expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
        expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom")

        //act
        await StateTracker.LogoutUser(testUser.Username, testUser.Password, testUser.Client)

        //assert
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
        expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
        expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
        expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toBeFalsy()

        //act
        await StateTracker.LogoutUser(testUser2.Username, testUser2.Password, testUser2.Client)

        //assert
        expect(fakeAuthentication).toBeCalledWith(testUser2.Username, testUser2.Password)
        expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser2.Username, testUser2.Client)
        expect(StateTracker.currentUsers.get(testUser2.Username)).toBeFalsy()

    });

    it("can join a room", async () =>{
        // arrange
        const testUser = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient"
        }

        const testUser2 = {
            Username: "yash",
            Password: "yashsPassword",
            Client: "yashsClient2"
        }

        // act
        await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)
        await StateTracker.LoginUser(testUser2.Username, testUser2.Password, testUser2.Client)

        // assert
        expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
        expect(fakeJoinRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
        expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
        expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom")
        
        // act
        await StateTracker.JoinRoom("roomyRoom", testUser.Username, testUser.Client)
        
        // assert
        expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
        expect(fakeJoinRoom).toBeCalledWith("roomyRoom", testUser.Username, testUser.Client)
        expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("roomyRoom")
    })
})

describe("Project", () => {
    it("can be created", async ()=>{
        // arrange
        var testProject = {
            projectName: "TestProject1",
            Description: "this is a project",
    
            datemodified: Date.now(),
            Id: "testId"
        }
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        }
        var testFlowProject = new FlowProject(testProject)

        // act
        await StateTracker.CreateProject(testFlowProject, testUser.Username)

        // assert
        expect(mongooseProjectCreateMock).toHaveBeenCalled()
    })

    it("can be deleted", async () => {

        await StateTracker.DeleteProject("testProject")

        // ngl this kinda feels stupid but woo bottom-up testing
        expect(fakeDestroyRoom).toBeCalledWith("testProject")
        expect(mongooseProjectDeleteMock).toBeCalledWith("testProject")

    })

    it("can be opened", () => {
        // throw new Error("not yet implemented")
    })

})