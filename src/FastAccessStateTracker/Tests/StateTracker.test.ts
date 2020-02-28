import { StateTracker } from "../StateTracker"

import { FlowUser } from "../FlowLibrary/FlowUser"
import MongooseDatabase from "../Database/MongooseDatabase"
import { RoomManager } from "../RoomManager"

const databaseUserCreationMock = jest.fn()

let roomManager : Map<string, Map<string, Array<string> > >

jest.mock('../Database/MongooseDatabase')
jest.mock('../RoomManager')

const fakeJoinRoom = jest.fn(async(roomCode: string, username:string, client: string) => {})
RoomManager.JoinRoom = fakeJoinRoom 

const fakeLeaveRoom = jest.fn(async(roomCode: string, username:string, client: string) => {})
RoomManager.LeaveRoom = fakeLeaveRoom 

const fakeAuthentication = jest.fn(async (username:string, password:string) => true)
MongooseDatabase.AuthenticateUser = fakeAuthentication

const mongooseUserDeleteMock = jest.fn(async (userToDelete: string) => {})
MongooseDatabase.DeleteUser = mongooseUserDeleteMock

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

    it("can join a room", () =>{
        // throw new Error("not yet implemented")
    })
})

describe("Project", () => {
    it("can be created", ()=>{
        // throw new Error("not yet implemented")
    })

    it("can be deleted", () => {
        // throw new Error("not yet implemented")
    })

    it("can be opened", () => {
        // throw new Error("not yet implemented")
    })

})