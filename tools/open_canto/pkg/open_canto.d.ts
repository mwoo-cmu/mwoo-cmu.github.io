/* tslint:disable */
/* eslint-disable */
export enum CongkitVersion {
  V3 = 0,
  V5 = 1,
}
export class CongkitFilter {
  free(): void;
  /**
   * @returns {CongkitFilter}
   */
  static all(): CongkitFilter;
  /**
   * @returns {CongkitFilter}
   */
  static all_chinese(): CongkitFilter;
  /**
   * @returns {CongkitFilter}
   */
  static japanese(): CongkitFilter;
  big5: boolean;
  chinese: boolean;
  hiragana: boolean;
  hkscs: boolean;
  kanji: boolean;
  katakana: boolean;
  misc: boolean;
  punctuation: boolean;
  taiwanese: boolean;
}
export class Dict {
  free(): void;
  /**
   * @param {CongkitVersion} version
   * @param {CongkitFilter} filter
   * @param {string} congkit_data
   * @param {Uint8Array} dict_data
   * @returns {Dict}
   */
  static new(version: CongkitVersion, filter: CongkitFilter, congkit_data: string, dict_data: Uint8Array): Dict;
  /**
   * @param {CongkitVersion} version
   */
  switch_ck_ver(version: CongkitVersion): void;
  /**
   * @param {CongkitVersion} version
   * @param {CongkitFilter} filter
   */
  rebuild_ck(version: CongkitVersion, filter: CongkitFilter): void;
  /**
   * @param {string} english
   * @param {string} chinese
   * @param {string} jyutping
   * @param {string} congkit
   * @param {string} source
   * @returns {any}
   */
  query_js(english: string, chinese: string, jyutping: string, congkit: string, source: string): any;
}
export class Options {
  free(): void;
  filters: CongkitFilter;
  version: CongkitVersion;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_dict_free: (a: number, b: number) => void;
  readonly dict_new: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => number;
  readonly dict_switch_ck_ver: (a: number, b: number) => void;
  readonly dict_rebuild_ck: (a: number, b: number, c: number) => void;
  readonly dict_query_js: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number) => number;
  readonly __wbg_options_free: (a: number, b: number) => void;
  readonly __wbg_get_options_version: (a: number) => number;
  readonly __wbg_set_options_version: (a: number, b: number) => void;
  readonly __wbg_get_options_filters: (a: number) => number;
  readonly __wbg_set_options_filters: (a: number, b: number) => void;
  readonly __wbg_congkitfilter_free: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_chinese: (a: number) => number;
  readonly __wbg_set_congkitfilter_chinese: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_big5: (a: number) => number;
  readonly __wbg_set_congkitfilter_big5: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_hkscs: (a: number) => number;
  readonly __wbg_set_congkitfilter_hkscs: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_taiwanese: (a: number) => number;
  readonly __wbg_set_congkitfilter_taiwanese: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_kanji: (a: number) => number;
  readonly __wbg_set_congkitfilter_kanji: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_hiragana: (a: number) => number;
  readonly __wbg_set_congkitfilter_hiragana: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_katakana: (a: number) => number;
  readonly __wbg_set_congkitfilter_katakana: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_punctuation: (a: number) => number;
  readonly __wbg_set_congkitfilter_punctuation: (a: number, b: number) => void;
  readonly __wbg_get_congkitfilter_misc: (a: number) => number;
  readonly __wbg_set_congkitfilter_misc: (a: number, b: number) => void;
  readonly congkitfilter_all: () => number;
  readonly congkitfilter_all_chinese: () => number;
  readonly congkitfilter_japanese: () => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly _dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h51a194e9927ed2d4: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
