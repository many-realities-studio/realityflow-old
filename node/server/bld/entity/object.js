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
const project_1 = require("./project");
let DBObject = class DBObject extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], DBObject.prototype, "_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DBObject.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DBObject.prototype, "Name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "X", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "Y", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "Z", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "Q_x", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "Q_y", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "Q_z", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "Q_w", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "S_x", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "S_y", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "S_z", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "R", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "G", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "B", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], DBObject.prototype, "A", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], DBObject.prototype, "Prefab", void 0);
__decorate([
    typeorm_1.ManyToOne(type => project_1.Project, proj => proj.ObjectList, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", project_1.Project)
], DBObject.prototype, "Project", void 0);
DBObject = __decorate([
    typeorm_1.Entity()
], DBObject);
exports.DBObject = DBObject;
//# sourceMappingURL=object.js.map