import init, {CongkitFilter, CongkitVersion, Dict} from "./pkg/open_canto.js"

function load_dict(ckdb, dict) {
  var filters = CongkitFilter.all_chinese();
  filters.taiwanese = false;
  var dict = Dict.new(CongkitVersion.V3, filters, ckdb, dict); 
}

function request_dict(ckdb) {
  var dict_xhr = new XMLHttpRequest();
  dict_xhr.onreadystatechange = () => {
    if (dict_xhr.readyState === 4) {
      load_dict(ckdb, dict_xhr.response);
    }
  };
  dict_xhr.open("GET", "./dict.dat");
  dict_xhr.send();  
}

function request_ckdb() {
  var ckdb_xhr = new XMLHttpRequest();
  ckdb_xhr.onreadystatechange = () => {
    if (ckdb_xhr.readyState === 4) {
      request_dict(ckdb_xhr.responseText);
    }
  };
  ckdb_xhr.open("GET", "./table.txt");
  ckdb_xhr.send();  
}

function run() {

}

init().then(run)
