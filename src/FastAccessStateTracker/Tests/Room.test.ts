import { Room } from "../Room"

// for mocking
import { FlowProject } from "../FlowLibrary/FlowProject"
import MongooseDatabase from "../Database/MongooseDatabase"
import { FlowUser } from "../FlowLibrary/FlowUser"

jest.mock('../Database/MongooseDatabase')
 
const returnProject = jest.fn( async (projectId: String) => {
    return new FlowProject({
        Id : projectId,
        Description : "This is a test Project",
        DateModified : Date.now(),
        ProjectName : "testProject",
    })
})

const returnUser = jest.fn( async (userName: String) => {
    return new FlowUser({
        Username : userName
    })

    
})

MongooseDatabase.GetProject = returnProject;
MongooseDatabase.GetUser = returnUser

describe("Rooms", () => {

    it("Can be created", async () => {
        let room : Room = await new Room("testProjectId")
        expect(returnProject).toHaveBeenCalledWith("testProjectId")
    })

    it("Can return its containing project", async() => {
        let room: Room = await new Room("testProjectId")
        let project: FlowProject = room.GetProject()

        expect(project.Id).toEqual("testProjectId")
        expect(project.Description).toEqual("This is a test Project")
        expect(project.ProjectName).toEqual("testProject")
    })

    it("Can allow a user to join the room", async () => {
        let room: Room = await new Room("testProjectId")
        let userName : String = "Yash"
        let clientId : String = "YashClient"

        await room.JoinRoom(userName, clientId)

        expect(returnUser).toHaveBeenCalled()
        expect(room.hasUser(userName)).toBeTruthy()

    })

    it("can tell when a user is not in the room", async () =>{
        let room: Room = await new Room("testProjectId")
        let userName : String = "Yash"
        expect(room.hasUser(userName)).toBeFalsy()

    })

    it("can allow multiple clients to join the room under the same username", async () => {
        let room: Room = await new Room("testProjectId")
        let userName : String = "Yash"
        let clientId1 : String = "YashClient"
        let clientId2 : String = "YashClient2"

        await room.JoinRoom(userName, clientId1)
        await room.JoinRoom(userName, clientId2)

        expect(returnUser).toHaveBeenCalled()
        expect(room.hasClient(userName, clientId1)).toBeTruthy()
        expect(room.hasClient(userName,clientId2)).toBeTruthy()
    })

    it("Can return its room code", async () => {
        let room: Room = await new Room("testProjectId")

        expect(room.GetRoomCode()).toEqual("testProjectId")
    })

    // it("Can be deleted", () => {
    //     let room : Room = new Room("testProjectId")
    //     expect(returnProject).toHaveBeenCalledWith("testProjectId")
    //     expect
    // })
})