/* tslint:disable */
/* eslint-disable */
export enum CongkitVersion {
  V3 = 0,
  V5 = 1,
}
export class CongkitFilter {
  free(): void;
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
   * @returns {Dict}
   */
  static new(version: CongkitVersion, filter: CongkitFilter): Dict;
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
