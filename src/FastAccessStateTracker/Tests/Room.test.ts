import { Room } from "../Room"

// for mocking
import { FlowProject } from "../FlowLibrary/FlowProject"
import TypeORMDatabase from "../Database/TypeORMDatabase"
import { FlowUser } from "../FlowLibrary/FlowUser"

jest.mock('../Database/TypeORMDatabase')
 
const returnProject = jest.fn( async (projectId: string) => {
    return new FlowProject({
        Id : projectId,
        Description : "This is a test Project",
        DateModified : Date.now(),
        ProjectName : "testProject",
    })
})

const returnUser = jest.fn( async (userName: string) => {
    return new FlowUser(userName)

    
})

TypeORMDatabase.GetProject = returnProject;
TypeORMDatabase.GetUser = returnUser

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
        let userName : string = "Yash"
        let clientId : string = "YashClient"

        await room.JoinRoom(userName, clientId)

        

        expect(returnUser).toHaveBeenCalled()
        expect(room.hasUser(userName)).toBeTruthy()
        expect(room.hasClient(userName, clientId)).toBeTruthy()
    })

    it("can tell when a user is not in the room", async () =>{
        let room: Room = await new Room("testProjectId")
        let userName : string = "Yash"
        expect(room.hasUser(userName)).toBeFalsy()
    })

    it("can tell when a user is not in the room", async () =>{
        let room: Room = await new Room("testProjectId")
        let userName : string = "Yash"
        let clientId: string = "testClient"
        expect(room.hasClient(userName, clientId)).toBeFalsy()
    })

    it("can allow multiple clients to join the room under the same username", async () => {
        let room: Room = await new Room("testProjectId")
        let userName : string = "Yash"
        let clientId1 : string = "YashClient"
        let clientId2 : string = "YashClient2"

        await room.JoinRoom(userName, clientId1)
        await room.JoinRoom(userName, clientId2)

        expect(returnUser).toHaveBeenCalled()
        expect(room.hasClient(userName, clientId1)).toBeTruthy()
        expect(room.hasClient(userName,clientId2)).toBeTruthy()
    })

    it("Can allow client(s) to leave the room and stops keeping track of user if all its clients have left", async () => {
        let room: Room = await new Room("testProjectId")
        let userName : string = "Yash"

        let clientId1 : string = "YashClient"
        let clientId2 : string = "YashClient2"

        await room.JoinRoom(userName, clientId1)
        await room.JoinRoom(userName, clientId2)
        expect(room.hasClient(userName, clientId1)).toBeTruthy()
        expect(room.hasClient(userName,clientId2)).toBeTruthy()
        expect(room.hasUser(userName)).toBeTruthy()

        await room.LeaveRoom(userName, clientId1)
        expect(room.hasClient(userName, clientId1)).toBeFalsy()

        await room.LeaveRoom(userName, clientId2)
        expect(room.hasClient(userName, clientId2)).toBeFalsy()
        expect(room.hasUser(userName)).toBeFalsy()

    })

    it("Can return its room code", async () => {
        let room: Room = await new Room("testProjectId")

        expect(room.GetRoomCode()).toEqual("testProjectId")
    })

    it("Can return all of the clients that are inside it", async () => {
        // arrange
        let room : Room = new Room("testProjectId")

        await room.JoinRoom("Yash",  "client1")
        await room.JoinRoom("Yash",  "client2")
        await room.JoinRoom("Nyasha","client1")

        // act
        let clients = room.getClients()
        
        // assert
        expect(clients.get("Yash").find(element => element == "client1")).toBeTruthy()
        expect(clients.get("Yash").find(element => element == "client2")).toBeTruthy()
        expect(clients.get("Nyasha").find(element => element == "client1")).toBeTruthy()
    
    
    })
})