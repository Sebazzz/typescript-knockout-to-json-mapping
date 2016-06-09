/// <reference path="../../bower_components/reflect-metadata/reflect-metadata.d.ts"/>
var TsMapping;
(function (TsMapping) {
    'use strict';
    var jsonMetadataKey = 'jsonProperty';
    function JsonProperty(metadata) {
        if (typeof metadata === 'string') {
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
                case 'string':
                case 'number':
                case 'boolean':
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
            else if (typeof Array.isArray === 'function') {
                return Array.isArray(object);
            }
            else {
                return !!(object instanceof Array);
            }
        };
        MapUtils.getClazz = function (target, propertyKey) {
            return Reflect.getMetadata('design:type', target, propertyKey);
        };
        MapUtils.getJsonProperty = function (target, propertyKey) {
            return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
        };
        MapUtils.deserialize = function (clazz, jsonObject) {
            if ((clazz === undefined) || (jsonObject === undefined)) {
                return undefined;
            }
            var obj = new clazz();
            Object.keys(obj).forEach(function (key) {
                var item = obj[key], itemIsObservable = ko.isObservable(item), itemIsWritableObservable = ko.isWriteableObservable(item), itemIsObservableArray = itemIsObservable && MapUtils.isArray(item.peek());
                if (itemIsObservable && !itemIsWritableObservable) {
                    // ignore this prop
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
    }());
    TsMapping.MapUtils = MapUtils;
})(TsMapping || (TsMapping = {}));
//# sourceMappingURL=Mapper.js.map