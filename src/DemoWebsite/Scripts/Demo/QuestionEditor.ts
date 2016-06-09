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

        public deleteQuestion(question: Question) {
            this.questions.remove(question);
        }

        public changeOrder(vm: Question, offset: number) {
            let idx = this.questions.indexOf(vm), arr = this.questions.peek();
            if (idx === -1 || idx === 0 && offset < 0) {
                return;
            }

            if (idx === arr.length - 1 && offset > 0) {
                return;
            }

            let tmp = arr[idx + offset];
            let tmpOrder = tmp.order.peek();

            tmp.order(vm.order.peek());
            vm.order(tmpOrder);

            this.questions.sort((x: Question, y: Question) => x.order() - y.order());
        }
    }

    QuestionEditor.initialize();
}