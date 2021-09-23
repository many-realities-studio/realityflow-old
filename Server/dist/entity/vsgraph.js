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
exports.VSGraph = void 0;
const typeorm_1 = require("typeorm");
const project_1 = require("./project");
let VSGraph = class VSGraph extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], VSGraph.prototype, "_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "Name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "serializedNodes", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "edges", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "groups", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "stackNodes", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "pinnedElements", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "exposedParameters", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "stickyNotes", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "position", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "scale", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "references", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], VSGraph.prototype, "paramIdToObjId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => project_1.Project, proj => proj.VSGraphList, { onDelete: "CASCADE", onUpdate: "CASCADE" }),
    __metadata("design:type", project_1.Project)
], VSGraph.prototype, "Project", void 0);
VSGraph = __decorate([
    typeorm_1.Entity()
], VSGraph);
exports.VSGraph = VSGraph;
//# sourceMappingURL=vsgraph.js.map