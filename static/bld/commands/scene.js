"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const project_1 = require("../models/project");
const scene_1 = require("../models/scene");
var objectId = mongoose.Types.ObjectId();
class SceneOperations {
    static createScene(sceneInfo) {
        var newSceneId;
        var newScene = new scene_1.Scene({
            _id: objectId,
            _parentProject: sceneInfo._parentProject,
            created: sceneInfo.created,
            objects: []
        });
        newScene.save(function (err, doc) {
            if (err) {
                console.log('ERROR: Failed to create scene in project: ' + newScene._parentProject);
            }
            else {
                console.log('New scene in project: ' + newScene._parentProject + ' added successfully.');
                newSceneId = doc._id;
            }
        });
        return newSceneId;
    }
    static fetchScenes(projectInfo) {
        var sceneId;
        project_1.Project.find({ _id: projectInfo._id }, 'currentScene', { lean: true }, function (err, scene) {
            sceneId = scene;
        });
        return sceneId;
    }
    static updateScene(sceneInfo) {
        scene_1.Scene.findOneAndUpdate({ _id: sceneInfo._id }, {
            _parentProject: sceneInfo._parentProject,
            created: sceneInfo.created,
            objects: sceneInfo.objects
        }, function (err) {
            if (err) {
                console.log('ERROR: Failed to update scene in project: ' + sceneInfo._parentProject);
            }
            else {
                console.log('Scene in project ' + sceneInfo._parentProject + ' updated successfully.');
            }
        });
    }
    static findScene(sceneInfo) {
        var scene;
        scene_1.Scene.findById(sceneInfo._id, { lean: true }, function (err, doc) {
            scene = doc;
        });
        return scene;
    }
    static deleteScene(sceneInfo) {
        scene_1.Scene.findByIdAndRemove(sceneInfo._id);
    }
}
exports.SceneOperations = SceneOperations;
