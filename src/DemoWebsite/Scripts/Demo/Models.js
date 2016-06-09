/// <reference path="../../bower_components/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/knockout/knockout.d.ts"/>
/// <reference path="Mapper.ts"/>
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var QuestionEditor;
(function (QuestionEditor) {
    'use strict';
    var JsonProperty = TsMapping.JsonProperty;
    (function (QuestionType) {
        QuestionType[QuestionType["MultipleChoice"] = 0] = "MultipleChoice";
        QuestionType[QuestionType["Text"] = 1] = "Text";
    })(QuestionEditor.QuestionType || (QuestionEditor.QuestionType = {}));
    var QuestionType = QuestionEditor.QuestionType;
    var Answer = (function () {
        function Answer() {
            this.id = 0;
            this.text = ko.observable();
            this.order = ko.observable(0);
            console.log('hello answer');
            // bind "this"
            this.changeOrderCallback = this.changeOrderCallback.bind(this);
        }
        Answer.prototype.changeOrderCallback = function (parent, offset) {
            var _this = this;
            return function () { return parent.changeOrder(_this, offset); };
        };
        return Answer;
    }());
    QuestionEditor.Answer = Answer;
    var Question = (function () {
        function Question() {
            this.text = ko.observable();
            this.id = 0;
            this.type = ko.observable(QuestionType.MultipleChoice);
            this.order = ko.observable(0);
            this.answers = ko.observableArray();
        }
        Question.prototype.changeOrderCallback = function (parent, offset) {
            var _this = this;
            return function () { return parent.changeOrder(_this, offset); };
        };
        Question.prototype.changeOrder = function (vm, offset) {
            var idx = this.answers.indexOf(vm), arr = this.answers.peek();
            if (idx === -1 || idx === 0 && offset < 0) {
                return;
            }
            if (idx === arr.length - 1 && offset > 0) {
                return;
            }
            var tmp = arr[idx + offset];
            var tmpOrder = tmp.order.peek();
            tmp.order(vm.order.peek());
            vm.order(tmpOrder);
            this.answers.sort(function (x, y) { return x.order() - y.order(); });
        };
        __decorate([
            JsonProperty({ clazz: Answer }), 
            __metadata('design:type', Object)
        ], Question.prototype, "answers", void 0);
        return Question;
    }());
    QuestionEditor.Question = Question;
})(QuestionEditor || (QuestionEditor = {}));
//# sourceMappingURL=Models.js.map