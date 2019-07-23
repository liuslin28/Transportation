// mineMap
var conf_domainUrl; //内部使用已隐藏
var conf_dataDomainUrl = conf_domainUrl;
var conf_spriteUrl = conf_domainUrl + '/minemapapi/v2.0.0/sprite/sprite';
var conf_serviceUrl = conf_domainUrl + '/service';
var conf_accessToken; //内部使用已隐藏
// 4744有路况
// var conf_solution = 4744;
// 4678无路况
var conf_solution = 4678;
var conf_centerPoint = [120.56, 31.10];
var conf_style = conf_serviceUrl + '/solu/style/id/' + conf_solution;


// 数据请求   ----geojson
// 站点数据
conf_station_query = './geojsonData/stopsPoint.json';
// 苏州城区面数据
conf_district_query = './geojsonData/suzhouDistrict.json';
// 中心城区面数据
conf_center_query = './geojsonData/centerPolygon.json';
// 古城区面数据
conf_oldcity_query = './geojsonData/oldCity.json';
// 公交专用道数据
conf_buslane_query = './geojsonData/busLane.json';
// 公交线路数据（目前为古城区数据,计算专用）
conf_busroute_query = './geojsonData/busRoute.json';
// 全部公交线路数据(串线后数据，展示用)
conf_busroutes_query = './geojsonData/busRoutes.json';
// 公交线路数据
conf_busline_query = './geojsonData/busLine.json';
// 公交线路数据(样例）routeSample
conf_busline_ex_query = './geojsonData/routeSample.json';

// 数据请求   ----geojson ---buffer
// 中心城区站点覆盖区
conf_cover_center_query = './geojsonData/cover/centercity_C_unP.json';
// 中心城区站点未覆盖区
conf_uncover_center_query = './geojsonData/cover/centercity_E_unP.json';

// 数据请求   ----esrijson
// 公交专用道数据
conf_esri_buslane_query = './esrijsonData/esribusLane.json';
// 公交线路数据（目前为古城区数据,计算专用）
conf_esri_busroute_query = './esrijsonData/esribusRoute.json';
// 公交线路数据（样例数据）
conf_esri_routesample_query = './esrijsonData/esrirouteSample.json';
// 道路中心线数据
conf_esri_roadline_query = './esrijsonData/esriroadLine.json';
// 中心城区面数据
conf_esri_center_query = './esrijsonData/esricenterPolygon.json';


