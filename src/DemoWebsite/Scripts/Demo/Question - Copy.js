/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="Mapper.ts"/>
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var QuestionType;
(function (QuestionType) {
    QuestionType[QuestionType["MultipleChoice"] = 0] = "MultipleChoice";
    QuestionType[QuestionType["Text"] = 1] = "Text";
})(QuestionType || (QuestionType = {}));
var Question = (function () {
    function Question() {
        this.text = ko.observable();
        this.id = 0;
        this.type = ko.observable(QuestionType.MultipleChoice);
        this.order = ko.observable(0);
        this.answers = ko.observableArray();
    }
    __decorate([
        JsonProperty('address')
    ], Question.prototype, "answers", void 0);
    return Question;
}());
exports.Question = Question;
var Answer = (function () {
    function Answer() {
        this.id = 0;
        this.text = ko.observable();
        this.order = ko.observable(0);
    }
    return Answer;
}());
exports.Answer = Answer;
var QuestionEditor = (function () {
    function QuestionEditor() {
        this.isLoading = ko.observable(true);
        this.questions = ko.observableArray();
    }
    QuestionEditor.initialize = function () {
        var editor = new QuestionEditor();
        QuestionEditor.instance = editor;
        ko.applyBindings(editor, document.getElementById('ko-root'));
        $.getJSON('/home/getquestions').done(function (x) { return editor.loadData(x); });
    };
    QuestionEditor.prototype.loadData = function (data) {
    };
    return QuestionEditor;
}());
exports.QuestionEditor = QuestionEditor;
