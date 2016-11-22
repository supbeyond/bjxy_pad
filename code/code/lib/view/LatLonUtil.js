/**
 * Created by GZXS on 2016/7/19.
 */
//经纬度偏移处理

XS.LatLonTUtil = {};
XS.LatLonTUtil.outOfChina = function (lat, lon)
{
    if (lon < 72.004 || lon > 137.8347)
        return true;
    if (lat < 0.8293 || lat > 55.8271)
        return true;
    return false;
}

XS.LatLonTUtil.transformLat = function(x, y)
{
    var pi = 3.14159265358979324;
    var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;

    return ret;
}

XS.LatLonTUtil.transformLon = function (x, y)
{
    var pi = 3.14159265358979324;

    var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;

    return ret;
}

XS.LatLonTUtil.transform = function(wgLat, wgLon)
{
    // Krasovsky 1940
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    var pi = 3.14159265358979324;
    var a = 6378245.0;
    var ee = 0.00669342162296594323;

    if (XS.LatLonTUtil.outOfChina(wgLat, wgLon))
    {
        mgLat = wgLat;
        mgLon = wgLon;
        return null;
    }
    var dLat = XS.LatLonTUtil.transformLat(wgLon - 105.0, wgLat - 35.0);
    var dLon = XS.LatLonTUtil.transformLon(wgLon - 105.0, wgLat - 35.0);
    var radLat = wgLat / 180.0 * pi;
    var magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);

    var mgLat = wgLat + dLat;
    var mgLon = wgLon + dLon;

    return {lat:mgLat, lon:mgLon};
}