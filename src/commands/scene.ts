/*import * as mongoose from "mongoose";
import {IProjectModel, Project} from "../models/project";
import {Scene, ISceneModel} from "../models/scene";

var objectId = mongoose.Types.ObjectId();

export class SceneOperations{

    public static createScene(sceneInfo: any){
        
        var newSceneId;

        var newScene = new Scene({
           
            _parentProject: sceneInfo._parentProject,
            created: sceneInfo.created,
            objects: []
            
        })

        newScene.save(function(err, doc){

            if(err){

                console.log('ERROR: Failed to create scene in project: ' + newScene._parentProject);

            }
            else{

                console.log('New scene in project: ' + newScene._parentProject + ' added successfully.');
                newSceneId = doc._id;

            }

        });

        return newSceneId;
    }

    public static fetchScenes(projectInfo: any){

        var sceneId;

       Project.find({_id: projectInfo._id}, 'currentScene', {lean: true}, function(err, scene){

        sceneId = scene;

       });

       return sceneId;
    }

    public static updateScene(sceneInfo: any){

        Scene.findOneAndUpdate({_id: sceneInfo._id}, {

            _parentProject: sceneInfo._parentProject,
            created: sceneInfo.created,
            objects: sceneInfo.objects

        }, function(err){

            if(err){

                console.log('ERROR: Failed to update scene in project: ' + sceneInfo._parentProject);

            }
            else{

                console.log('Scene in project ' + sceneInfo._parentProject + ' updated successfully.');

            }

        });
    }

    public static findScene(sceneInfo: any){

        var scene;

        Scene.findById(sceneInfo._id, {lean: true}, function(err, doc){

            scene = doc;

        });

        return scene;

    }

    public static deleteScene(sceneInfo: any){

        Scene.findByIdAndRemove(sceneInfo._id);

    }
}*/