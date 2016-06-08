/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/knockout/knockout.d.ts"/>
/// <reference path="Mapper.ts"/>

module QuestionEditor {
    import JsonProperty = TsMapping.JsonProperty;

    export enum QuestionType {
        MultipleChoice,
        Text
    }

    export class Answer {
        public id: number = 0;
        public text = ko.observable<string>();
        public order = ko.observable<number>(0);

        constructor() {
            console.log('hello answer');

            // Bind "this"
            this.changeOrderCallback = this.changeOrderCallback.bind(this);
        }

        public changeOrderCallback(parent: Question, offset: number) {
            return () => parent.changeOrder(this, offset);
        }
    }

    export class Question {
        public text = ko.observable<string>();
        public id: number = 0;
        public type = ko.observable<QuestionType>(QuestionType.MultipleChoice);
        public order = ko.observable<number>(0);

        @JsonProperty({ clazz: Answer })
        public answers = ko.observableArray<Answer>();


        public changeOrder(vm: Answer, offset: number) {
            let idx = this.answers.indexOf(vm), arr = this.answers.peek();
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

            this.answers.sort((x, y) => x.order() - y.order());
        }
    }

    export class QuestionEditor {
        public static instance;

        public isLoading = ko.observable<boolean>(true);

        public static initialize() {
            var editor = new QuestionEditor();

            QuestionEditor.instance = editor;
            ko.applyBindings(editor, document.getElementById('ko-root'));

            $.getJSON('/home/getquestions').done(x => editor.loadData(x));
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