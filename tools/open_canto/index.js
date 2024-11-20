import init, {CongkitFilter, CongkitVersion, Dict} from "./pkg/open_canto.js"

function run() {
  var filters = CongkitFilter.all_chinese();
  filters.taiwanese = false;
  var dict = Dict.new(CongkitVersion.V3, filters); 
}

init().then(run)
