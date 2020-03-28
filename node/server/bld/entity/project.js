"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_1 = require("./user");
const object_1 = require("./object");
let Project = class Project extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({ unique: true }),
    __metadata("design:type", String)
], Project.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "Description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Project.prototype, "DateModified", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Project.prototype, "ProjectName", void 0);
__decorate([
    typeorm_1.OneToMany(type => object_1.DBObject, object => object.Project),
    __metadata("design:type", Array)
], Project.prototype, "ObjectList", void 0);
__decorate([
    typeorm_1.ManyToOne(type => user_1.User, user => user.Projects, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", user_1.User)
], Project.prototype, "Owner", void 0);
Project = __decorate([
    typeorm_1.Entity()
], Project);
exports.Project = Project;
//# sourceMappingURL=project.js.map