import * as wasm from "./pkg/open_canto"

var filters = new wasm.CongkitFilter();
filters.chinese = true;
filters.big5 = true;
filters.hkscs = true;
var dict = wasm.Dict.new(wasm.CongkitVersion.V3, filters);
