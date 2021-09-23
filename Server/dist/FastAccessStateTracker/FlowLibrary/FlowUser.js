"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowUser = void 0;
class FlowUser {
    constructor(username, ActiveClients = [], Projects = []) {
        this.ActiveClients = [];
        this.Username = username;
        this.ActiveClients = ActiveClients;
        this.Projects = Projects;
    }
    tostring() {
        return JSON.stringify({
            ActiveClients: this.ActiveClients,
            Username: this.Username,
            Projects: this.Projects
        });
    }
    Login(newClientLogin) {
        this.ActiveClients.push(newClientLogin);
    }
    Logout(client) {
        const index = this.ActiveClients.findIndex((element) => element == client);
        var ClosedConnection = null;
        if (index > -1) {
            ClosedConnection = this.ActiveClients.splice(index, 1)[0];
        }
    }
    addProject(projectIdToAdd) {
        this.Projects.push(projectIdToAdd);
    }
}
exports.FlowUser = FlowUser;
//# sourceMappingURL=FlowUser.js.map