import init, {CongkitFilter, CongkitVersion, Dict} from "./pkg/open_canto.js"

function load_dict(data) {
  var filters = CongkitFilter.all_chinese();
  filters.taiwanese = false;
  var dict = Dict.new(CongkitVersion.V3, filters, data); 
}

function run() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      load_dict(xhr.response);
    }
  };
  xhr.open("GET", "./dict.dat");
  xhr.send();
}

init().then(run)
