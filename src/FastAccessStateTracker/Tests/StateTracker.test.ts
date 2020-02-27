import { StateTracker } from "../StateTracker"

import { FlowUser } from "../FlowLibrary/FlowUser"
import MongooseDatabase from "../Database/MongooseDatabase"

const databaseUserCreationMock = jest.fn()
jest.mock('../Database/MongooseDatabase')


describe("User",() => {
    it("can be created", async () => {
        const testUser = new FlowUser({
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        })
        
        const mongooseUserCreateMock = jest.fn(async (userToCreate: FlowUser) => {}) 

        MongooseDatabase.CreateUser = mongooseUserCreateMock

        //act
        await StateTracker.CreateUser(testUser)

        //assert
        expect(mongooseUserCreateMock).toHaveBeenCalledWith(testUser)
    });

    it("can be deleted", async () =>{
        const testUser = new FlowUser({
            Username: "YashStateTracker",
            Password: "StateTrackerYash"
        })

        const mongooseUserDeleteMock = jest.fn(async (userToDelete: FlowUser) => {})
        MongooseDatabase.DeleteUser = mongooseUserDeleteMock

        await StateTracker.DeleteUser(testUser)

        expect(mongooseUserDeleteMock).toHaveBeenCalledWith(FlowUser)
    });

    it("can be logged in", () => {

    });

    it("can be logged out", ()=>{

    });
})