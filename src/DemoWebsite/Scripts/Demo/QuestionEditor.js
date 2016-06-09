/// <reference path="../../bower_components/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/knockout/knockout.d.ts"/>
/// <reference path="Mapper.ts"/>
var QuestionEditor;
(function (QuestionEditor_1) {
    'use strict';
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
            var questions = [];
            for (var i = 0, cnt = data.length; i < cnt; i++) {
                questions.push(TsMapping.MapUtils.deserialize(QuestionEditor_1.Question, data[i]));
            }
            this.questions(questions);
            this.isLoading(false);
        };
        return QuestionEditor;
    }());
    QuestionEditor_1.QuestionEditor = QuestionEditor;
    QuestionEditor.initialize();
})(QuestionEditor || (QuestionEditor = {}));
//# sourceMappingURL=QuestionEditor.js.map