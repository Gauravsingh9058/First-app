//#region node_modules/.nitro/vite/services/ssr/assets/date-utils-CMo_soRo.js
/**
* Returns a YYYY-MM-DD date string formatted according to the local device timezone,
* preventing UTC shift bugs where evening or night logs get recorded under yesterday's/tomorrow's date.
*/
function getLocalDateString(date = /* @__PURE__ */ new Date()) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
//#endregion
export { getLocalDateString as t };
