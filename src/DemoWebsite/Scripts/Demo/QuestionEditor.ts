/// <reference path="../../bower_components/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/knockout/knockout.d.ts"/>
/// <reference path="Mapper.ts"/>

module QuestionEditor {
    'use strict';

    export class QuestionEditor {
        public static instance;

        public isLoading = ko.observable<boolean>(true);

        public static initialize() {
            var editor = new QuestionEditor();

            QuestionEditor.instance = editor;
            ko.applyBindings(editor, document.getElementById('ko-root'));

            $.getJSON('/home/getquestions').done((x : any[]) => editor.loadData(x));
        }

        public questions = ko.observableArray<Question>();

        public loadData(data: any[]): void {
            var questions = [];
            for (let i = 0, cnt = data.length; i < cnt; i++) {
                questions.push(
                    TsMapping.MapUtils.deserialize<Question>(Question, data[i])
                );
            }

            this.questions(questions);
            this.isLoading(false);
        }

    }

    QuestionEditor.initialize();
}