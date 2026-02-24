// urlParams.mjs - small helper to parse URL query parameters
export function parseQueryParams() {
  const params = {};
  const queryString = window.location.search.substring(1);
  if (!queryString) return params;
  const queryParts = queryString.split("&");
  for (let i = 0; i < queryParts.length; i++) {
    const param = queryParts[i].split("=");
    params[decodeURIComponent(param[0])] = decodeURIComponent(param[1] || "");
  }
  return params;
}
