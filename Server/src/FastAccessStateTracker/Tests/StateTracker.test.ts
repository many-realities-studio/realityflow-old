// import { StateTracker } from "../StateTracker"

// import { FlowUser } from "../FlowLibrary/FlowUser"
// import TypeORMDatabase from "../Database/TypeORMDatabase"
// import { RoomManager } from "../RoomManager"
// import { FlowProject } from "../FlowLibrary/FlowProject"
// import { Project } from "../../entity/project"
// import { FlowObject } from "../FlowLibrary/FlowObject"
// import {FlowBehavior} from "../FlowLibrary/FlowBehavior"
// import { ProjectOperations } from "../../ORMCommands/project"
// import { Behavior } from "../../entity/behavior"

// const databaseUserCreationMock = jest.fn()

// let roomManager : Map<string, Map<string, Array<string> > >;



// jest.mock('../Database/TypeORMDatabase');
// jest.mock('../RoomManager');
// jest.mock('../../ORMCommands/project')


// const fakeJoinRoom = jest.fn(async(roomCode: string, username:string, client: string) => {});
// RoomManager.JoinRoom = fakeJoinRoom ;

// const fakeLeaveRoom = jest.fn(async(roomCode: string, username:string, client: string) => {});
// RoomManager.LeaveRoom = fakeLeaveRoom;

// const fakeDestroyRoom = jest.fn((roomCode:string) => new Map<string, Array<string>>());
// RoomManager.DestroyRoom = fakeDestroyRoom;

// // const fakeAddBehavior = jest.fn(async(roomCode: string) => {});
// // RoomManager.FindRoom(fakeRoomCode).GetProject().AddBehavior = fakeAddBehavior;

// const fakeGetClients = jest.fn((roomCode) => {
//     let x = new Map<string, Array<string>>()
//     x.set("testUser", ["testClient1", "testClient2"])
//     return x
// });
// RoomManager.getClients = fakeGetClients;

// const fakeAuthentication = jest.fn(async (username:string, password:string) => true);
// TypeORMDatabase.AuthenticateUser = fakeAuthentication;

// const TypeORMProjectDeleteMock = jest.fn(async (projectToDelete: string) => {});
// TypeORMDatabase.DeleteProject = TypeORMProjectDeleteMock;

// const TypeORMUserDeleteMock = jest.fn(async (userToDelete: string) => {});
// TypeORMDatabase.DeleteUser = TypeORMUserDeleteMock;

// const TypeORMProjectCreateMock = jest.fn( async (projectToCreate: FlowProject) => {return new Project()});
// TypeORMDatabase.CreateProject = TypeORMProjectCreateMock;

// const TypeORMObjectCreateMock = jest.fn( async (objectToCreate: FlowObject, projectId: string) => {});
// TypeORMDatabase.CreateObject = TypeORMObjectCreateMock;

// const TypeORMBehaviorCreateMock = jest.fn( async (BehaviorToCreate: FlowBehavior[], objectId) => {});
// TypeORMDatabase.CreateBehavior = TypeORMBehaviorCreateMock;


// const TypeORMProjectGetMock = jest.fn( async (projectToGet: string) => {
//     return new FlowProject({
//         Id: projectToGet,
//         Description: "TestDescription",
//         DateModified: Date.now(),
//         ProjectName: "hello"
//     })
// });
// TypeORMDatabase.GetProject = TypeORMProjectGetMock;

// TypeORMDatabase.fetchProjects = jest.fn( async () => [])

// let checkoutManager : Map<string, string> = new Map<string, string>();

// describe("User", () => {
//     it("can be created", async () => {
//         const testUser = {
//             Username: "YashStateTracker",
//             Password: "StateTrackerYash",
//             Client: "yashsClient"
//         }
        
//         const TypeORMUserCreateMock = jest.fn(async (userName:string, Password: string) => {}) 

//         TypeORMDatabase.CreateUser = TypeORMUserCreateMock

//         //act
//         await StateTracker.CreateUser(testUser.Username, testUser.Password, testUser.Client)

//         //assert
//         expect(TypeORMUserCreateMock).toHaveBeenCalledWith(testUser.Username, testUser.Password)
//     });

//     it("can be deleted", async () =>{
//         // arrange
//         const testUser = {
//             Username: "YashStateTracker",
//             Password: "StateTrackerYash"
//         }       
//         // act
//         await StateTracker.DeleteUser(testUser.Username, testUser.Password)
        
//         // assert
//         expect(TypeORMUserDeleteMock).toHaveBeenCalledWith(testUser.Username)
//     });

//     it("can be logged in", async () => {
//         // arrange
//         const testUser = {
//             Username: "yash",
//             Password: "yashsPassword",
//             Client: "yashsClient"
//         }

//         // act
//         await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)

//         // assert
//         expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
//         expect(fakeJoinRoom).lastCalledWith("noRoom", testUser.Username, testUser.Client)
//         expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
//         expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom")
//     });

//     it("can be logged out", async ()=>{
//         // arrange
//         const testUser = {
//             Username: "yash",
//             Password: "yashsPassword",
//             Client: "yashsClient"
//         }

//         const testUser2 = {
//             Username: "yash",
//             Password: "yashsPassword2",
//             Client: "yashsClient2"
//         }

//         // act
//         await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)
//         await StateTracker.LoginUser(testUser2.Username, testUser2.Password, testUser2.Client)

//         // assert
//         expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
//         expect(fakeJoinRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
//         expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
//         expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom")

//         //act
//         await StateTracker.LogoutUser(testUser.Username, testUser.Password, testUser.Client)

//         //assert
//         expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
//         expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
//         expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
//         expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toBeFalsy()

//         //act
//         await StateTracker.LogoutUser(testUser2.Username, testUser2.Password, testUser2.Client)

//         //assert
//         expect(fakeAuthentication).toBeCalledWith(testUser2.Username, testUser2.Password)
//         expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser2.Username, testUser2.Client)
//         expect(StateTracker.currentUsers.get(testUser2.Username)).toBeFalsy()

//     });

//     it("can join a room", async () =>{
//         // arrange
//         const testUser = {
//             Username: "yash",
//             Password: "yashsPassword",
//             Client: "yashsClient"
//         }

//         const testUser2 = {
//             Username: "yash",
//             Password: "yashsPassword",
//             Client: "yashsClient2"
//         }

//         // act
//         await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)
//         await StateTracker.LoginUser(testUser2.Username, testUser2.Password, testUser2.Client)

//         // assert
//         expect(fakeAuthentication).toBeCalledWith(testUser.Username, testUser.Password)
//         expect(fakeJoinRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
//         expect(StateTracker.currentUsers.get(testUser.Username)).toBeTruthy()
//         expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("noRoom")
        
//         // act
//         await StateTracker.JoinRoom("roomyRoom", testUser.Username, testUser.Client)
        
//         // assert
//         expect(fakeLeaveRoom).toBeCalledWith("noRoom", testUser.Username, testUser.Client)
//         expect(fakeJoinRoom).toBeCalledWith("roomyRoom", testUser.Username, testUser.Client)
//         expect(StateTracker.currentUsers.get(testUser.Username).get(testUser.Client)).toEqual("roomyRoom")
//     })
// })

// describe("Project", () => {
//     it("can be created", async ()=>{
//         // arrange
//         var testProject = {
//             projectName: "TestProject1",
//             Description: "this is a project",
    
//             datemodified: Date.now(),
//             Id: "testId"
//         }
//         const testUser = {
//             Username: "YashStateTracker",
//             Password: "StateTrackerYash",
//             Client: "yashsClient"
//         }
//         var testFlowProject = new FlowProject(testProject)
//         await StateTracker.LoginUser(testUser.Username, testUser.Password, testUser.Client)
//         // act
//         await StateTracker.CreateProject(testFlowProject, testUser.Username, testUser.Client)

//         // assert
//         expect(TypeORMProjectCreateMock).toHaveBeenCalled()
//     })

//     it("can be deleted", async () => {
//         await StateTracker.LoginUser("testUser", "password", "testClient")
//         await StateTracker.DeleteProject("testProject", "testUser", "testClient")

//         // ngl this kinda feels stupid but woo bottom-up testing
//         expect(fakeDestroyRoom).toBeCalledWith("testProject")
//         expect(TypeORMProjectDeleteMock).toBeCalledWith("testProject")

//     })

//     it("can be opened", async () => {
//         // arrange
//         await StateTracker.LoginUser("testUser", "password", "testClient")
//         // act
//         await StateTracker.OpenProject("newProject", "testUser", "testClient")
//         // assert
//         expect(TypeORMProjectGetMock).toBeCalledWith("newProject")
//     })

// })

// describe("Object", () => {
//     it("Can be created", async () =>{

//         var createdObject = new FlowObject({
//             Id:             "createdObjectId",
//             name:           "object1",
//             X:              3,
//             Y:              1,
//             Z:              1,
//             Q_x:            1,
//             Q_y:            1,
//             Q_z:            1,
//             Q_w:            1,
//             S_x:            1,
//             S_y:            1,
//             S_z:            1,
//             R:              1,
//             G:              1,
//             B:              1,
//             A:              1,
//         })
        
//         await StateTracker.CreateObject(createdObject, "projectId") 

//         expect(TypeORMObjectCreateMock).toHaveBeenCalled()

//     })

//     it("Can be read", async () => {
//         let fakeRead = jest.fn((projectId, userId) => new FlowObject({}))
//         RoomManager.ReadObject = fakeRead;
//         await StateTracker.ReadObject("ObjectId", "projectId", "client")
//         expect(fakeRead).toHaveBeenCalled()
//     })

//     it("can be updated", async () =>{
//         let fakeUpdate = jest.fn(() => true)
//         RoomManager.updateObject = fakeUpdate;

//         var updatedObject = new FlowObject({
//             Id:             "updatedObjectId",
//             name:           "object1",
//             X:              3,
//             Y:              1,
//             Z:              1,
//             Q_x:            1,
//             Q_y:            1,
//             Q_z:            1,
//             Q_w:            1,
//             S_x:            1,
//             S_y:            1,
//             S_z:            1,
//             R:              1,
//             G:              1,
//             B:              1,
//             A:              1,
//         })

//         await StateTracker.UpdateObject(updatedObject, "projectId", "client")
//         expect(fakeUpdate).toHaveBeenCalled()
//     })

//     it("can be deleted", async () => {
//         let fakeDelete = jest.fn(() => true)
//         RoomManager.DeleteObject = fakeDelete;
//         await StateTracker.DeleteObject("ObjectId", "projectId",  "client")
//         expect(fakeDelete).toHaveBeenCalled()
//     })


// })

// describe("checkout system", () => {
    
    
//     it("allows an object to be checked out", async ()=>{
//         let fakeCheckout = jest.fn(() => true)
//         RoomManager.checkoutObject = fakeCheckout;
//         await StateTracker.CheckoutObject("projectId", "objectId", "client")
//         expect(fakeCheckout).toHaveBeenCalled()

//     })

//     it("allows an object to be checked in", async () => {
//         let fakeCheckin = jest.fn(() => true)
//         RoomManager.checkinObject = fakeCheckin;
//         await StateTracker.CheckinObject("projectId", "objectId", "client")
//         expect(fakeCheckin).toHaveBeenCalled()
//     })
    
// })


// describe("Behavior", () => {
//     it("Can be created", async () => {
//         var createdBehavior =StateTracker.listifyBehavior(
//             {
//             Name: "testBehavior",
//             Id: "createdBehaviorId",
//             Trigger: "triggerObjectId",
//             Target: "targetObjectId",
//             Index : "1234",
//             ChainOwner: "Owner",
//         });

//         let projectId = "1234";

//         RoomManager.CreateRoom(projectId);

//         await StateTracker.CreateBehavior(createdBehavior, "objectId", projectId);

//         expect(TypeORMBehaviorCreateMock).toHaveBeenCalled()
//     })

//     it("can be deleted", () => {

//     })
// })