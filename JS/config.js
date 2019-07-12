// mineMap
// var conf_domainUrl; //内部使用已隐藏
var conf_dataDomainUrl = conf_domainUrl;
var conf_spriteUrl = conf_domainUrl + '/minemapapi/v2.0.0/sprite/sprite';
var conf_serviceUrl = conf_domainUrl + '/service';
// var conf_accessToken; //内部使用已隐藏
// 4744有路况
// var conf_solution = 4744;
// 4678无路况
var conf_solution = 4678;
var conf_centerPoint = [120.56, 31.10];
var conf_style = conf_serviceUrl + '/solu/style/id/' + conf_solution;


// 数据请求   ----geojson
// 站点数据
conf_station_query = './geojsonData/stopsPoint.json';
// 中心城区面数据
conf_center_query = './geojsonData/centerPolygon.json';
// 公交专用道数据
conf_buslane_query = './geojsonData/busLane.json';
// 公交线路数据
conf_busroute_query = './geojsonData/busRoute.json';


// 数据请求   ----esrijson
// 公交专用道数据
conf_esri_buslane_query = './esrijsonData/esribusLane.json';
// 公交线路数据
conf_esri_busroute_query = './esrijsonData/esribusRoute.json';
// 道路中心线数据
conf_esri_roadline_query = './esrijsonData/esriroadLine.json';
// 中心城区面数据
conf_esri_center_query = './esrijsonData/esricenterPolygon.json';


