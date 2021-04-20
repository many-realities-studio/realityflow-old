import { Room } from "../Room"

// for mocking
import { FlowProject } from "../FlowLibrary/FlowProject"
import TypeORMDatabase from "../Database/TypeORMDatabase"
import { FlowUser } from "../FlowLibrary/FlowUser"
import { FlowObject } from "../FlowLibrary/FlowObject"
import { FlowVSGraph } from "../FlowLibrary/FlowVSGraph"
import { FlowNodeView } from "../FlowLibrary/FlowNodeView"

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

describe("Object in a room", () => {
    it("can be created", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var createdObject = new FlowObject({
            Id:             "createdObjectId",
            name:           "object1",
            X:              3,
            Y:              1,
            Z:              1,
            Q_x:            1,
            Q_y:            1,
            Q_z:            1,
            Q_w:            1,
            S_x:            1,
            S_y:            1,
            S_z:            1,
            R:              1,
            G:              1,
            B:              1,
            A:              1,
        })

        // act
        room.AddObject(createdObject)
        let check = room.GetProject()._ObjectList.find(object => object.Id = createdObject.Id)
        
        // assert
        expect(check).toBeTruthy()
    })

    it("can be read", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var readObject = new FlowObject({
            Id:             "readObjectId",
            name:           "object1",
            X:              3,
            Y:              1,
            Z:              1,
            Q_x:            1,
            Q_y:            1,
            Q_z:            1,
            Q_w:            1,
            S_x:            1,
            S_y:            1,
            S_z:            1,
            R:              1,
            G:              1,
            B:              1,
            A:              1,
        })

        room.AddObject(readObject)

        // act
        let check = room.ReadObject(readObject.Id)
        // assert
        expect(check.Id).toEqual(readObject.Id)
    })



    it("can be checked out", async () => {
        // arrange

        let room : Room = await new Room("testProjectId")
        var oldObject = new FlowObject({
            Id:             "updatedObjectId",
            name:           "object1",
            X:              3,
            Y:              1,
            Z:              1,
            Q_x:            1,
            Q_y:            1,
            Q_z:            1,
            Q_w:            1,
            S_x:            1,
            S_y:            1,
            S_z:            1,
            R:              1,
            G:              1,
            B:              1,
            A:              1,
        })

        room.AddObject(oldObject)

        // act
        room.checkoutObject(oldObject.Id,  "client")
        
        // assert
        let check = room.ReadObject(oldObject.Id)
        expect(check.CurrentCheckout).toEqual("client");
    })

    it("can be checked in", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var oldObject = new FlowObject({
            Id:             "updatedObjectId",
            name:           "object1",
            X:              3,
            Y:              1,
            Z:              1,
            Q_x:            1,
            Q_y:            1,
            Q_z:            1,
            Q_w:            1,
            S_x:            1,
            S_y:            1,
            S_z:            1,
            R:              1,
            G:              1,
            B:              1,
            A:              1,
        })

        room.AddObject(oldObject)
        room.checkoutObject(oldObject.Id,  "client")
        
        // act
        room.checkinObject(oldObject.Id,  "client")
        // assert
        let check = room.ReadObject(oldObject.Id)
        expect(check.CurrentCheckout).toBeFalsy()
    })

    it("can only be checked in by the right person", async () => {
                // arrange
                let room : Room = await new Room("testProjectId")
                var oldObject = new FlowObject({
                    Id:             "updatedObjectId",
                    name:           "object1",
                    X:              3,
                    Y:              1,
                    Z:              1,
                    Q_x:            1,
                    Q_y:            1,
                    Q_z:            1,
                    Q_w:            1,
                    S_x:            1,
                    S_y:            1,
                    S_z:            1,
                    R:              1,
                    G:              1,
                    B:              1,
                    A:              1,
                })
        
                room.AddObject(oldObject)
                room.checkoutObject(oldObject.Id, "client1")
                
                // act
                room.checkinObject(oldObject.Id,  "client2")
                // assert
                let check = room.ReadObject(oldObject.Id)
                expect(check.CurrentCheckout).toEqual("client1")
    })
    it("cannot be checked out while it is checked out by someone else.", async() => {
                        // arrange
                        let room : Room = await new Room("testProjectId")
                        var oldObject = new FlowObject({
                            Id:             "updatedObjectId",
                            name:           "object1",
                            X:              3,
                            Y:              1,
                            Z:              1,
                            Q_x:            1,
                            Q_y:            1,
                            Q_z:            1,
                            Q_w:            1,
                            S_x:            1,
                            S_y:            1,
                            S_z:            1,
                            R:              1,
                            G:              1,
                            B:              1,
                            A:              1,
                        })
                
                        room.AddObject(oldObject)
                        room.checkoutObject(oldObject.Id,  "client1")
                        
                        // act
                        room.checkoutObject(oldObject.Id,  "client2")
                        // assert
                        let check = room.ReadObject(oldObject.Id)
                        expect(check.CurrentCheckout).toEqual("client1")
    })


    it("can be updated", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var oldObject = new FlowObject({
            Id:             "updatedObjectId",
            name:           "object1",
            X:              3,
            Y:              1,
            Z:              1,
            Q_x:            1,
            Q_y:            1,
            Q_z:            1,
            Q_w:            1,
            S_x:            1,
            S_y:            1,
            S_z:            1,
            R:              1,
            G:              1,
            B:              1,
            A:              1,
        })

        room.AddObject(oldObject)

        var newObject = new FlowObject({
            Id:             "updatedObjectId",
            name:           "object1",
            X:              666,
            Y:              666,
            Z:              666,
            Q_x:            1,
            Q_y:            1,
            Q_z:            1,
            Q_w:            1,
            S_x:            1,
            S_y:            1,
            S_z:            1,
            R:              1,
            G:              1,
            B:              1,
            A:              1,
        })

        // act
        room.checkoutObject(newObject.Id, "client")
        room.updateObject(newObject, "client")
        
        // assert
        let check = room.GetProject()._ObjectList.find(object => object.Id = oldObject.Id)
        expect(check.X).toEqual(newObject.X)
})

    it("can be deleted", async () => {
    // arrange

    let room : Room = await new Room("testProjectId")
    var oldObject = new FlowObject({
        Id:             "updatedObjectId",
        name:           "object1",
        X:              3,
        Y:              1,
        Z:              1,
        Q_x:            1,
        Q_y:            1,
        Q_z:            1,
        Q_w:            1,
        S_x:            1,
        S_y:            1,
        S_z:            1,
        R:              1,
        G:              1,
        B:              1,
        A:              1,
    })

    room.AddObject(oldObject)

    // act
    room.checkoutObject(oldObject.Id, "client")
    room.DeleteObject(oldObject.Id,  "client")
    // assert
    let check = room.ReadObject(oldObject.Id);
    expect(check).toBeFalsy()
    })

})

describe("VSGraph in a room", () => {
    it("can be created", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var createdVSGraph = new FlowVSGraph({
            Id:                 "createdVSGraphId",
            Name:               "createdVSGraphName",
            serializedNodes:    "[]",
            edges:              "[]",
            groups:             "[]",
            stackNodes:         "[]",
            pinnedElements:     "[]",
            exposedParameters:  "[]",
            stickyNotes:        "[]",
            position:           "{\"x\":0,\"y\":0,\"z\":0}",
            scale:              "{\"x\":1,\"y\":1,\"z\":1}",
            references:         "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId:     "{\"keys\":[],\"values\":[]}"
        })

        // act
        room.AddVSGraph(createdVSGraph)
        let check = room.GetProject()._VSGraphList.find(vsgraph => vsgraph.Id = createdVSGraph.Id)
        
        // assert
        expect(check).toBeTruthy()
    })

    it("can be read", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var readVSGraph = new FlowVSGraph({
            Id:                 "readVSGraphId",
            Name:               "readVSGraphName",
            serializedNodes:    "[]",
            edges:              "[]",
            groups:             "[]",
            stackNodes:         "[]",
            pinnedElements:     "[]",
            exposedParameters:  "[]",
            stickyNotes:        "[]",
            position:           "{\"x\":0,\"y\":0,\"z\":0}",
            scale:              "{\"x\":1,\"y\":1,\"z\":1}",
            references:         "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId:     "{\"keys\":[],\"values\":[]}"
        })

        room.AddVSGraph(readVSGraph)

        // act
        let check = room.ReadVSGraph(readVSGraph.Id)
        // assert
        expect(check.Id).toEqual(readVSGraph.Id)
    })

    it("can be updated", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var oldVSGraph = new FlowVSGraph({
            Id:                 "updatedVSGraphId",
            Name:               "updatedVSGraphName",
            serializedNodes:    "[]",
            edges:              "[]",
            groups:             "[]",
            stackNodes:         "[]",
            pinnedElements:     "[]",
            exposedParameters:  "[]",
            stickyNotes:        "[]",
            position:           "{\"x\":0,\"y\":0,\"z\":0}",
            scale:              "{\"x\":1,\"y\":1,\"z\":1}",
            references:         "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId:     "{\"keys\":[],\"values\":[]}"
        })

        room.AddVSGraph(oldVSGraph)

        var newVSGraph = new FlowVSGraph({
            Id:                 "updatedVSGraphId",
            Name:               "updatedVSGraphName",
            serializedNodes:    "[]",
            edges:              "[]",
            groups:             "[]",
            stackNodes:         "[]",
            pinnedElements:     "[]",
            exposedParameters:  "[]",
            stickyNotes:        "[]",
            position:           "{\"x\":0,\"y\":0,\"z\":0}",
            scale:              "{\"x\":1,\"y\":1,\"z\":1}",
            references:         "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
            paramIdToObjId:     "{\"keys\":[newParamId],\"values\":[newFlowObjectId]}"
        })

        // act
        room.updateVSGraph(newVSGraph, "client")
        
        // assert
        let check = room.GetProject()._VSGraphList.find(vsgraph => vsgraph.Id = oldVSGraph.Id)
        expect(check.paramIdToObjId).toEqual(newVSGraph.paramIdToObjId)
})

    it("can be deleted", async () => {
    // arrange

    let room : Room = await new Room("testProjectId")
    var oldVSGraph = new FlowVSGraph({
        Id:                 "deletedVSGraphId",
        Name:               "deletedVSGraphName",
        serializedNodes:    "[]",
        edges:              "[]",
        groups:             "[]",
        stackNodes:         "[]",
        pinnedElements:     "[]",
        exposedParameters:  "[]",
        stickyNotes:        "[]",
        position:           "{\"x\":0,\"y\":0,\"z\":0}",
        scale:              "{\"x\":1,\"y\":1,\"z\":1}",
        references:         "{\"version\":1,\"00000000\":{\"type\":{\"class\":\"Terminus\",\"ns\":\"UnityEngine.DMAT\",\"asm\":\"FAKE_ASM\"},\"data\":{}}}",
        paramIdToObjId:     "{\"keys\":[],\"values\":[]}"
    })

    room.AddVSGraph(oldVSGraph)

    // act
    room.DeleteVSGraph(oldVSGraph.Id,  "client")
    // assert
    let check = room.ReadVSGraph(oldVSGraph.Id);
    expect(check).toBeFalsy()
    })

})

describe("NodeView in a room", () => {
    it("can be read", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var readNodeView = new FlowNodeView({
            LocalPos:           "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID:           "readNodeViewId",
        })

        // Nodeviews are checked out and added in the same operation due to their temporary nature. Check in deletes the nodeview.
        room.checkoutNodeView(readNodeView, "client")

        // act
        let check = room.ReadNodeView(readNodeView.NodeGUID)
        // assert
        expect(check.NodeGUID).toEqual(readNodeView.NodeGUID)
    })



    it("can be checked out", async () => {
        // arrange

        let room : Room = await new Room("testProjectId")
        var oldNodeView = new FlowNodeView({
            LocalPos:           "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID:           "updatedNodeViewId",
        })

        // act
        room.checkoutNodeView(oldNodeView,  "client")
        
        // assert
        let check = room.ReadNodeView(oldNodeView.NodeGUID)
        expect(check.CurrentCheckout).toEqual("client");
    })

    it("can be checked in", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var oldNodeView = new FlowNodeView({
            LocalPos:           "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID:           "updatedNodeViewId",
        })

        // Nodeviews are checked out and added in the same operation due to their temporary nature. Check in deletes the nodeview.
        room.checkoutNodeView(oldNodeView,  "client")
        
        // act
        room.checkinNodeView(oldNodeView.NodeGUID,  "client")
        // assert
        let check = room.ReadNodeView(oldNodeView.NodeGUID)
        expect(check != null).toBeFalsy()
    })

    it("can only be checked in by the right person", async () => {
                // arrange
                let room : Room = await new Room("testProjectId")
                var oldNodeView = new FlowNodeView({
                    LocalPos:           "{\"x\":0,\"y\":0,\"z\":0}",
                    NodeGUID:           "updatedNodeViewId",
                })
        
                // Nodeviews are checked out and added in the same operation due to their temporary nature. Check in deletes the nodeview.
                room.checkoutNodeView(oldNodeView, "client1")
                
                // act
                room.checkinNodeView(oldNodeView.NodeGUID,  "client2")
                // assert
                let check = room.ReadNodeView(oldNodeView.NodeGUID)
                expect(check.CurrentCheckout).toEqual("client1")
    })
    it("cannot be checked out while it is checked out by someone else.", async() => {
                        // arrange
                        let room : Room = await new Room("testProjectId")
                        var oldNodeView = new FlowNodeView({
                            LocalPos:           "{\"x\":0,\"y\":0,\"z\":0}",
                            NodeGUID:           "updatedNodeViewId",
                        })
                
                        // Nodeviews are checked out and added in the same operation due to their temporary nature. Check in deletes the nodeview.
                        room.checkoutNodeView(oldNodeView,  "client1")
                        
                        // act
                        room.checkoutNodeView(oldNodeView,  "client2")
                        // assert
                        let check = room.ReadNodeView(oldNodeView.NodeGUID)
                        expect(check.CurrentCheckout).toEqual("client1")
    })


    it("can be updated", async () => {
        // arrange
        let room : Room = await new Room("testProjectId")
        var oldNodeView = new FlowNodeView({
            LocalPos:           "{\"x\":0,\"y\":0,\"z\":0}",
            NodeGUID:           "updatedNodeViewId",
        })

        // Nodeviews are checked out and added in the same operation due to their temporary nature. Check in deletes the nodeview.
        room.checkoutNodeView(oldNodeView, "client")

        var newNodeView = new FlowNodeView({
            LocalPos:           "{\"x\":24,\"y\":24,\"z\":24}",
            NodeGUID:           "updatedNodeViewId",
        })

        // act
        room.updateNodeView(newNodeView, "client")
        
        // assert
        let check = room.GetProject()._NodeViewList.find(nodeview => nodeview.NodeGUID = oldNodeView.NodeGUID)
        expect(check.LocalPos).toEqual(newNodeView.LocalPos)
    })

})