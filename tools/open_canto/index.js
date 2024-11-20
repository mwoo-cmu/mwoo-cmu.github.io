import {CongkitFilter, CongkitVersion, Dict} from "./pkg/open_canto.js"

var filters = new CongkitFilter();
filters.chinese = true;
filters.big5 = true;
filters.hkscs = true;
var dict = Dict.new(CongkitVersion.V3, filters);
