/// <reference path="../../bower_components/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../typings/jquery/jquery.d.ts"/>
/// <reference path="../typings/knockout/knockout.d.ts"/>
/// <reference path="Mapper.ts"/>

module QuestionEditor {
    'use strict';

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

            // bind "this"
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

            this.answers.sort((x: Answer, y: Answer) => x.order() - y.order());
        }
    }
}