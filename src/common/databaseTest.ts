import * as mongoose from "mongoose";
import { UserOperations } from "../commands/user"
import { databaseController } from "./databaseController"
import { ProjectOperations } from "../commands/project";

var database;
const dburl = "mongodb://127.0.0.1:27017/realityflowdb";

var testUser = {
    username: "Yash",
    password: "test"
};

var testClient = {
    deviceType: 1
}

var testInput = {
    user: testUser,
    client: testClient
}

var testProject1 = {
    projectName: "TestProject1",
    created: Date.now(),
    lastEdit: Date.now(),
    lastEditor: null
}

var testProject2 = {
    projectName: "TestProject2",
    created: Date.now(),
    lastEdit: Date.now(),
    lastEditor: null
}

var object1 = {
    type:           "string",
    name:           "object1",
    triangles:      [1,2,3],
    x:              3,
    y:              1,
    z:              1,
    q_x:            1,
    q_y:            1,
    q_z:            1,
    q_w:            1,
    s_x:            1,
    s_y:            1,
    s_z:            1,
    color:          {},
    vertices:       [1,2],
    uv:             [2,34],
    texture:        [1,3],
    textureHeight:  1,
    textureWidth:   1,
    textureFormat:  1,
    mipmapCount:    1,
    locked:         false,
}

var object2 = {
    type:           "string",
    name:           "object2",
    triangles:      [1,2,3],
    x:              3,
    y:              2,
    z:              3,
    q_x:            4,
    q_y:            5,
    q_z:            6,
    q_w:            7,
    s_x:            8,
    s_y:            9,
    s_z:            20,
    color:          {},
    vertices:       [1,2],
    uv:             [2,34],
    texture:        [1,3],
    textureHeight:  2,
    textureWidth:   4,
    textureFormat:  25,
    mipmapCount:    23,
    locked:         false,
}




async function main(){
    mongoose.connect(dburl);
    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'connection error: '));
    database.once('open', function(){
    console.log('Database connection successful at ' + dburl);
    });

    var userData = await testUserCreateAndDelete(false);
    
    testProject1.lastEditor = userData.user._id;
    testProject2.lastEditor = userData.user._id;

    var projectData1 = await testProjectCreateAndDelete(testProject1, userData, false);
    var projectData2 = await testProjectCreateAndDelete(testProject2, userData, false);

    var loginData = await databaseController.loginUser(testInput)
    
    
    //should probably do actual assert-y stuff here but whatever
    console.log(JSON.stringify(loginData))

    //logout
    console.log("-------object-----\n");
    await testObjectMethods(object1, object2, projectData1);

    

}

async function testObjectMethods(objectData1: any, objectData2: any, projectData: any){
    var testIn1 = {obj: objectData1, project: JSON.parse(projectData).project};
    var testIn1obj2 = {obj: objectData2, project: JSON.parse(projectData).project};

    var objOut1 = await databaseController.createObject(testIn1);
    var obj2Out1 = await databaseController.createObject(testIn1obj2);
    
    console.log(objOut1);
    console.log(obj2Out1)

    var testIn2 = objOut1;
    testIn2.obj.x = -1;
    await databaseController.updateObject(testIn2);
    
    // await databaseController.deleteObject(testIn2)
    console.log('----fetch output----')
    // console.log(testIn1)
    var fetchOut = await databaseController.fetchObjects(testIn1)
    console.log(fetchOut)
}

async function testUserCreateAndDelete(delTestUser: Boolean = false){
    var verbose = false;
    
    var createdUserOutput = await databaseController.createUser(testInput)
    if (verbose){
        console.log(createdUserOutput)
        console.log("---Pre Delete---")
    }
    
    var findOut = await UserOperations.findUser(createdUserOutput.user)
    
    if(verbose)
        console.log(findOut)
    
    if (delTestUser){
        
        await UserOperations.deleteUser(createdUserOutput.user);
        console.log("---Post Delete---");
        var findOut = await UserOperations.findUser(createdUserOutput.user);
        console.log("hello");
        console.log(findOut);

        // there should be no user to return
        return null;
    }

    return createdUserOutput;
}

async function testProjectCreateAndDelete(testProject: any, userData: any, delTestProject: Boolean){
    userData.project = testProject;
    var projectData = await databaseController.createProject(userData);
    
    // so... I'm calling deleteproject and it's deleting the project but 
    // somehow not before findproject finds it?? Investigate. It is definitely deleting the project though.
    if(delTestProject){
        await databaseController.deleteProject(JSON.parse(projectData).project);
        var notDeleted = await ProjectOperations.findProject(JSON.parse(projectData).project);
        
        console.log("hello" + notDeleted);
        
        if(notDeleted){
            console.log("Oops! the project wasn't deleted!");
        } 
    }
    return projectData;
}

main()
