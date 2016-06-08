var TsMapping;
(function (TsMapping) {
    var jsonMetadataKey = "jsonProperty";
    function JsonProperty(metadata) {
        if (metadata instanceof String || typeof metadata === "string") {
            return Reflect.metadata(jsonMetadataKey, {
                name: metadata,
                clazz: undefined
            });
        }
        else {
            var metadataObj = metadata;
            return Reflect.metadata(jsonMetadataKey, {
                name: metadataObj ? metadataObj.name : undefined,
                clazz: metadataObj ? metadataObj.clazz : undefined
            });
        }
    }
    TsMapping.JsonProperty = JsonProperty;
    var MapUtils = (function () {
        function MapUtils() {
        }
        MapUtils.isPrimitive = function (obj) {
            switch (typeof obj) {
                case "string":
                case "number":
                case "boolean":
                    return true;
            }
            return !!(obj instanceof String || obj === String ||
                obj instanceof Number || obj === Number ||
                obj instanceof Boolean || obj === Boolean);
        };
        MapUtils.isArray = function (object) {
            if (object === Array) {
                return true;
            }
            else if (typeof Array.isArray === "function") {
                return Array.isArray(object);
            }
            else {
                return !!(object instanceof Array);
            }
        };
        MapUtils.getClazz = function (target, propertyKey) {
            return Reflect.getMetadata("design:type", target, propertyKey);
        };
        MapUtils.getJsonProperty = function (target, propertyKey) {
            return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
        };
        MapUtils.deserialize = function (clazz, jsonObject) {
            if ((clazz === undefined) || (jsonObject === undefined))
                return undefined;
            var obj = new clazz();
            Object.keys(obj).forEach(function (key) {
                var item = obj[key], itemIsObservable = ko.isObservable(item), itemIsWritableObservable = ko.isWriteableObservable(item), itemIsObservableArray = itemIsObservable && MapUtils.isArray(item.peek());
                if (itemIsObservable && !itemIsWritableObservable) {
                    // Ignore this prop
                    return;
                }
                var propertyMetadataFn = function (propertyMetadata) {
                    var propertyName = propertyMetadata.name || key;
                    var innerJson = jsonObject ? jsonObject[propertyName] : undefined;
                    var clazz = MapUtils.getClazz(obj, key);
                    var metadata = MapUtils.getJsonProperty(obj, key);
                    if (itemIsObservableArray) {
                        if (metadata.clazz || MapUtils.isPrimitive(clazz)) {
                            if (innerJson && MapUtils.isArray(innerJson)) {
                                return innerJson.map(function (item) { return MapUtils.deserialize(metadata.clazz, item); });
                            }
                            else {
                                return undefined;
                            }
                        }
                        else {
                            return innerJson;
                        }
                    }
                    else if (!MapUtils.isPrimitive(metadata.clazz)) {
                        return MapUtils.deserialize(clazz, innerJson);
                    }
                    else {
                        return jsonObject ? jsonObject[propertyName] : undefined;
                    }
                };
                var propertyMetadata = MapUtils.getJsonProperty(obj, key);
                if (propertyMetadata) {
                    if (itemIsObservable) {
                        obj[key](propertyMetadataFn(propertyMetadata));
                    }
                    else {
                        obj[key] = propertyMetadataFn(propertyMetadata);
                    }
                }
                else {
                    if (jsonObject && jsonObject[key] !== undefined) {
                        if (itemIsObservable) {
                            obj[key](jsonObject[key]);
                        }
                        else {
                            obj[key] = jsonObject[key];
                        }
                    }
                }
            });
            return obj;
        };
        return MapUtils;
    })();
    TsMapping.MapUtils = MapUtils;
})(TsMapping || (TsMapping = {}));

/// <reference path="../../node_modules/reflect-metadata/reflect-metadata.d.ts"/>
/// <reference path="../../typings/jquery/jquery.d.ts"/>
/// <reference path="../../typings/knockout/knockout.d.ts"/>
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
(function (QuestionEditor_1) {
    var JsonProperty = TsMapping.JsonProperty;
    (function (QuestionType) {
        QuestionType[QuestionType["MultipleChoice"] = 0] = "MultipleChoice";
        QuestionType[QuestionType["Text"] = 1] = "Text";
    })(QuestionEditor_1.QuestionType || (QuestionEditor_1.QuestionType = {}));
    var QuestionType = QuestionEditor_1.QuestionType;
    var Answer = (function () {
        function Answer() {
            this.id = 0;
            this.text = ko.observable();
            this.order = ko.observable(0);
            console.log('hello answer');
            // Bind "this"
            this.changeOrderCallback = this.changeOrderCallback.bind(this);
        }
        Answer.prototype.changeOrderCallback = function (parent, offset) {
            var _this = this;
            return function () { return parent.changeOrder(_this, offset); };
        };
        return Answer;
    })();
    QuestionEditor_1.Answer = Answer;
    var Question = (function () {
        function Question() {
            this.text = ko.observable();
            this.id = 0;
            this.type = ko.observable(QuestionType.MultipleChoice);
            this.order = ko.observable(0);
            this.answers = ko.observableArray();
        }
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
    })();
    QuestionEditor_1.Question = Question;
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
                questions.push(TsMapping.MapUtils.deserialize(Question, data[i]));
            }
            this.questions(questions);
            this.isLoading(false);
        };
        return QuestionEditor;
    })();
    QuestionEditor_1.QuestionEditor = QuestionEditor;
    QuestionEditor.initialize();
})(QuestionEditor || (QuestionEditor = {}));

//# sourceMappingURL=appscripts.js.map
