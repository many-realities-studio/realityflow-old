import { StateTracker } from "../StateTracker"

import { FlowUser } from "../FlowLibrary/FlowUser"
import MongooseDatabase from "../Database/MongooseDatabase"

const databaseUserCreationMock = jest.fn()
jest.mock('../Database/MongooseDatabase')


describe("User",() => {
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
        const testUser = {
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        }

        const mongooseUserDeleteMock = jest.fn(async (userToDelete: string) => {})
        MongooseDatabase.DeleteUser = mongooseUserDeleteMock

        await StateTracker.DeleteUser(testUser.Username, testUser.Password)

        expect(mongooseUserDeleteMock).toHaveBeenCalledWith(testUser.Username)
    });

    it("can be logged in", () => {
        const testUser = {
            Username: "yash",
            Password: "yashsPassword"
        }

        
    });

    it("can be logged out", ()=>{

    });
})