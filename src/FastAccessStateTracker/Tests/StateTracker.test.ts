import { StateTracker } from "../StateTracker"

import { FlowUser } from "../FlowLibrary/FlowUser"
import TypeORMDatabase from "../Database/TypeORMDatabase"
import { RoomManager } from "../RoomManager"
import { FlowProject } from "../FlowLibrary/FlowProject"

const databaseUserCreationMock = jest.fn()

let roomManager : Map<string, Map<string, Array<string> > >

jest.mock('../Database/TypeORMDatabase')
jest.mock('../RoomManager')

const fakeJoinRoom = jest.fn(async(roomCode: string, username:string, client: string) => {})
RoomManager.JoinRoom = fakeJoinRoom 

const fakeLeaveRoom = jest.fn(async(roomCode: string, username:string, client: string) => {})
RoomManager.LeaveRoom = fakeLeaveRoom 

const fakeDestroyRoom = jest.fn((roomCode:string) => new Map<string, Array<string>>())
RoomManager.DestroyRoom = fakeDestroyRoom

const fakeGetClients = jest.fn((roomCode) => {
    let x = new Map<string, Array<string>>()
    x.set("testUser", ["testClient1", "testClient2"])
    return x
})
RoomManager.getClients = fakeGetClients

const fakeAuthentication = jest.fn(async (username:string, password:string) => true)
TypeORMDatabase.AuthenticateUser = fakeAuthentication

const TypeORMProjectDeleteMock = jest.fn(async (projectToDelete: string) => {})
TypeORMDatabase.DeleteProject = TypeORMProjectDeleteMock

const TypeORMUserDeleteMock = jest.fn(async (userToDelete: string) => {})
TypeORMDatabase.DeleteUser = TypeORMUserDeleteMock

const TypeORMProjectCreateMock = jest.fn( async (projectToCreate: FlowProject) => {} )  
//TypeORMDatabase.CreateProject = TypeORMProjectCreateMock


const TypeORMProjectGetMock = jest.fn( async (projectToGet: string) => {
    return new FlowProject({
        Id: projectToGet,
        Description: "TestDescription",
        DateModified: Date.now(),
        ProjectName: "hello"
    })
})
TypeORMDatabase.GetProject = TypeORMProjectGetMock


describe("User", () => {
    it("can be created", async () => {
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash",
            Client: "yashsClient"
        }
        
        const TypeORMUserCreateMock = jest.fn(async (userName:string, Password: string) => {}) 

        TypeORMDatabase.CreateUser = TypeORMUserCreateMock

        //act
        await StateTracker.CreateUser(testUser.Username, testUser.Password, testUser.Client)

        //assert
        expect(TypeORMUserCreateMock).toHaveBeenCalledWith(testUser.Username, testUser.Password)
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
        expect(TypeORMUserDeleteMock).toHaveBeenCalledWith(testUser.Username)
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
            Password: "StateTrackerYash",
            Client: "yashsClient"
        }
        var testFlowProject = new FlowProject(testProject)

        // act
        await StateTracker.CreateProject(testFlowProject, testUser.Username, testUser.Client)

        // assert
        expect(TypeORMProjectCreateMock).toHaveBeenCalled()
    })

    it("can be deleted", async () => {

        await StateTracker.DeleteProject("testProject", "fakeUser", "fakeClient")

        // ngl this kinda feels stupid but woo bottom-up testing
        expect(fakeDestroyRoom).toBeCalledWith("testProject")
        expect(TypeORMProjectDeleteMock).toBeCalledWith("testProject")

    })

    it("can be opened", async () => {
        // arrange

        // act
       // await StateTracker.OpenProject("newProject")
        // assert
        expect(TypeORMProjectGetMock).toBeCalledWith("newProject")
    })

})