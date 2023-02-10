import {
  equalStr,
  fromEnumToOptions,
  getArrayFromField,
  isAllPropertyOfObjectIsEmpty,
  processObject,
  uuidv4,
} from "./generals";

describe("generals", () => {
  it("fromEnumToOptions", () => {
    const result = fromEnumToOptions({ test: "value" });
    expect(result).toEqual([{ label: "test", value: "value" }]);
  });

  it("uuidv4", () => {
    const result = uuidv4();
    expect(typeof result).toEqual("string");
  });

  it("equalStr", () => {
    const result = equalStr("test1", "test2");
    expect(result).toEqual(false);
    expect(equalStr("test1", "tesT1")).toEqual(true);
  });

  it("isAllPropertyOfObjectIsEmpty", () => {
    expect(isAllPropertyOfObjectIsEmpty({ name: "alex" })).toEqual(false);
    expect(isAllPropertyOfObjectIsEmpty({ name: "", age: "" })).toEqual(true);
    expect(isAllPropertyOfObjectIsEmpty(null)).toEqual(true);
    expect(isAllPropertyOfObjectIsEmpty({})).toEqual(true);
    expect(isAllPropertyOfObjectIsEmpty({ age: 22 })).toEqual(false);
    expect(isAllPropertyOfObjectIsEmpty({ age: 0 })).toEqual(true);
  });

  it("processObject", () => {
    expect(
      processObject({
        obj: { name: "alex", age: "20", address: "" },
        listKeyToConvertToNumber: ["age"],
      })
    ).toEqual({
      name: "alex",
      age: 20,
    });
  });
  it("getArrayFromField", () => {
    expect(getArrayFromField(null)).toEqual([]);
    expect(getArrayFromField([1])).toEqual([1]);
    expect(getArrayFromField(1)).toEqual([1]);
    expect(getArrayFromField("")).toEqual([]);
    expect(getArrayFromField("test")).toEqual(["test"]);
  });
});
