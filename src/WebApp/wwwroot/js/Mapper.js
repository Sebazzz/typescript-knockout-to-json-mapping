"use strict";
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
exports.JsonProperty = JsonProperty;
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
            var propertyMetadataFn = function (propertyMetadata) {
                var propertyName = propertyMetadata.name || key;
                var innerJson = jsonObject ? jsonObject[propertyName] : undefined;
                var clazz = MapUtils.getClazz(obj, key);
                if (MapUtils.isArray(clazz)) {
                    var metadata_1 = MapUtils.getJsonProperty(obj, key);
                    if (metadata_1.clazz || MapUtils.isPrimitive(clazz)) {
                        if (innerJson && MapUtils.isArray(innerJson)) {
                            return innerJson.map(function (item) { return MapUtils.deserialize(metadata_1.clazz, item); });
                        }
                        else {
                            return undefined;
                        }
                    }
                    else {
                        return innerJson;
                    }
                }
                else if (!MapUtils.isPrimitive(clazz)) {
                    return MapUtils.deserialize(clazz, innerJson);
                }
                else {
                    return jsonObject ? jsonObject[propertyName] : undefined;
                }
            };
            var propertyMetadata = MapUtils.getJsonProperty(obj, key);
            if (propertyMetadata) {
                obj[key] = propertyMetadataFn(propertyMetadata);
            }
            else {
                if (jsonObject && jsonObject[key] !== undefined) {
                    obj[key] = jsonObject[key];
                }
            }
        });
        return obj;
    };
    return MapUtils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapUtils;
