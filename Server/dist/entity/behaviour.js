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
exports.Behaviour = void 0;
const typeorm_1 = require("typeorm");
let Behaviour = class Behaviour extends typeorm_1.BaseEntity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Behaviour.prototype, "_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "Id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "TypeOfTrigger", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "TriggerObjectId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "TargetObjectId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "ProjectId", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "NextBehaviour", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Behaviour.prototype, "Action", void 0);
Behaviour = __decorate([
    typeorm_1.Entity()
], Behaviour);
exports.Behaviour = Behaviour;
//# sourceMappingURL=behaviour.js.map