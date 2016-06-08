module TsMapping {
    export interface IJsonMetaData<T> {
        name?: string,
        clazz?: { new (): T }
    }
    const jsonMetadataKey = "jsonProperty";
    export function JsonProperty<T>(metadata?: IJsonMetaData<T> | string): any {
        if (metadata instanceof String || typeof metadata === "string") {
            return Reflect.metadata(jsonMetadataKey, {
                name: metadata,
                clazz: undefined
            });
        } else {
            let metadataObj = <IJsonMetaData<T>>metadata;
            return Reflect.metadata(jsonMetadataKey, {
                name: metadataObj ? metadataObj.name : undefined,
                clazz: metadataObj ? metadataObj.clazz : undefined
            });
        }
    }

    export class MapUtils {
        static isPrimitive(obj) {
            switch (typeof obj) {
                case "string":
                case "number":
                case "boolean":
                    return true;
            }
            return !!(obj instanceof String || obj === String ||
                obj instanceof Number || obj === Number ||
                obj instanceof Boolean || obj === Boolean);
        }

        static isArray(object) {
            if (object === Array) {
                return true;
            } else if (typeof Array.isArray === "function") {
                return Array.isArray(object);
            }
            else {
                return !!(object instanceof Array);
            }
        }

        static getClazz(target: any, propertyKey: string): any {
            return Reflect.getMetadata("design:type", target, propertyKey);
        }

        static getJsonProperty<T>(target: any, propertyKey: string): IJsonMetaData<T> {
            return Reflect.getMetadata(jsonMetadataKey, target, propertyKey);
        }

        static deserialize<T>(clazz: { new (): T }, jsonObject) {
            if ((clazz === undefined) || (jsonObject === undefined)) return undefined;
            let obj = new clazz();

            Object.keys(obj).forEach((key) => {
                var item = obj[key],
                    itemIsObservable = ko.isObservable(item),
                    itemIsWritableObservable = ko.isWriteableObservable(item),
                    itemIsObservableArray = itemIsObservable && MapUtils.isArray(item.peek());

                if (itemIsObservable && !itemIsWritableObservable) {
                    // Ignore this prop
                    return;
                }

                let propertyMetadataFn: (x : IJsonMetaData<any>) => any = (propertyMetadata) => {
                    let propertyName = propertyMetadata.name || key;
                    let innerJson = jsonObject ? jsonObject[propertyName] : undefined;

                    let clazz = MapUtils.getClazz(obj, key);
                    let metadata = MapUtils.getJsonProperty(obj, key);

                    if (itemIsObservableArray) {
                        if (metadata.clazz || MapUtils.isPrimitive(clazz)) {
                            if (innerJson && MapUtils.isArray(innerJson)) {
                                return innerJson.map(
                                    (item) => MapUtils.deserialize(metadata.clazz, item)
                                );
                            } else {
                                return undefined;
                            }
                        } else {
                            return innerJson;
                        }
                    } else if (!MapUtils.isPrimitive(metadata.clazz)) {
                        return MapUtils.deserialize(clazz, innerJson);
                    } else {
                        return jsonObject ? jsonObject[propertyName] : undefined;
                    }
                };

                let propertyMetadata = MapUtils.getJsonProperty(obj, key);
                if (propertyMetadata) {
                    if (itemIsObservable) {
                        obj[key](propertyMetadataFn(propertyMetadata));
                    } else {
                        obj[key] = propertyMetadataFn(propertyMetadata);
                    }
                } else {
                    if (jsonObject && jsonObject[key] !== undefined) {
                        if (itemIsObservable) {
                            obj[key](jsonObject[key]);
                        } else {
                            obj[key] = jsonObject[key];
                        }
                    }
                }
            });

            return obj;
        }
    }
}