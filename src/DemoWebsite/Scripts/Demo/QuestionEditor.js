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
        QuestionEditor.prototype.deleteQuestion = function (question) {
            this.questions.remove(question);
        };
        QuestionEditor.prototype.changeOrder = function (vm, offset) {
            var idx = this.questions.indexOf(vm), arr = this.questions.peek();
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
            this.questions.sort(function (x, y) { return x.order() - y.order(); });
        };
        return QuestionEditor;
    }());
    QuestionEditor_1.QuestionEditor = QuestionEditor;
    QuestionEditor.initialize();
})(QuestionEditor || (QuestionEditor = {}));
//# sourceMappingURL=QuestionEditor.js.map