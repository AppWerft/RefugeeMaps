"toRadians"in Number.prototype||(Number.prototype.toDegrees=function(){return 180*this/Math.PI}),"toRadians"in Number.prototype||(Number.prototype.toRadians=function(){return this*Math.PI/180});var geonamesuser=Ti.App.Properties.hasProperty("geonamesuser")?Ti.App.Properties.getString("geonamesuser"):"demo",googleapikey=Ti.App.Properties.hasProperty("googleapikey")?Ti.App.Properties.getString("googleapikey"):"demo",Promise=require("org.favo.promise"),TI_XML_ELEMENT_NODE=Ti.XML.Node.ELEMENT_NODE,parseAndRenderKML=function(e,a){console.log(">>>>>>>>>>>>");for(var t,n,r=(new Date).getTime(),g=e.getElementsByTagName("Placemark"),i=g.length,l={};i;){t=g.item(--i).getChildNodes();for(var s,o,u=0,m=t.length;m>u;u++)s=t.item(u),o=s.getNodeName(),"#text"!=o&&(l[o]=s.getTextContent());if(n=l.Point){var d=n.replace(/\s/g,"").split(",");l.latitude=parseFloat(d[1],10),l.longitude=parseFloat(d[0],10),delete l.Point,a.points.push(l)}else void 0!==l.LineString?a.lines.push(l):void 0!==l.Polygon&&a.polygones.push(l)}console.log("Info: KML parsingtime: "+((new Date).getTime()-r))},Module={getPositionByIP:function(e){var a=e?e:Ti.Platform.getAddress(),t=Promise.defer(),n=Ti.Network.createHTTPClient({onload:function(){console.log(this.responseText),t.resolve(JSON.parse(this.responseText))},onerror:function(e){console.log(e),t.reject(e)}});return n.open("GET","http://freegeoip.net/json/"+a),console.log("http://freegeoip.net/json/"+a),n.send(),t},getElevation:function(){var e=arguments[0]||{},a=Array.isArray(e)?e[0]:e.lat||e.latitude,t=Array.isArray(e)?e[1]:e.lng||e.lon||e.longitude,n=Promise.defer(),r=Ti.Network.createHTTPClient({onload:function(){n.resolve(JSON.parse(this.responseText))},onerror:function(e){n.reject(e)}});return r.open("POST","http://api.geonames.org/astergdemJSON?lat="+a+"&lng="+t+"&username="+geonamesuser),r.send(),n},getRegionByCountry:function(e){var a=Promise.defer(),t=e||"Deutschland",n=Ti.Network.createHTTPClient({onload:function(){try{var e=JSON.parse(this.responseText);if("OK"==e.status){var t=e.results[0].geometry,n={latitude:t.location.lat,longitude:t.location.lng,latitudeDelta:Math.abs(t.viewport.northeast.lat-t.viewport.southwest.lat),longitudeDelta:Math.abs(t.viewport.northeast.lng-t.viewport.southwest.lng)};a.resolve(n)}}catch(r){a.reject(r)}},onerror:function(){a.reject(_e)}});return n.open("GET","http://maps.googleapis.com/maps/api/geocode/json?address="+t+"&sensor=false"),n.send(),a},getRoute:function(){var e=Promise.defer(),a=function(e){for(var a=e.length,t=0,n=[],r=0,g=0;a>t;){var i,l=0,s=0;do i=e.charCodeAt(t++)-63,s|=(31&i)<<l,l+=5;while(i>=32);var o=1&s?~(s>>1):s>>1;r+=o,l=0,s=0;do i=e.charCodeAt(t++)-63,s|=(31&i)<<l,l+=5;while(i>=32);var u=1&s?~(s>>1):s>>1;g+=u,n.push([1e-5*r,1e-5*g])}for(var m=[],d=0;d<n.length;d++)m.push({latitude:n[d][0],longitude:n[d][1]});return m},t=arguments[0]||{},n=arguments[1]||{},r=arguments[2]||"WALKING",g=Array.isArray(t)?t[0]:t.lat||t.latitude,i=Array.isArray(t)?t[1]:t.lng||t.lon||t.longitude,l=Array.isArray(n)?n[0]:n.lat||n.latitude,s=Array.isArray(n)?n[1]:n.lng||n.lon||n.longitude,o=Ti.Network.createHTTPClient({onload:function(){var t=JSON.parse(this.responseText).routes[0];t?e.resolve({steps:t.legs[0].steps,meta:t.legs[0].distance.text+"\n"+t.legs[0].duration.text,end_address:t.legs[0].end_address,start_address:t.legs[0].start_address,region:{latitude:(t.bounds.northeast.lat+t.bounds.southwest.lat)/2,longitude:(t.bounds.northeast.lng+t.bounds.southwest.lng)/2,latitudeDelta:1.2*Math.abs(t.bounds.northeast.lat-t.bounds.southwest.lat),longitudeDelta:1.2*Math.abs(t.bounds.northeast.lng-t.bounds.southwest.lng)},route:a(t.overview_polyline.points)}):e.reject()}}),u="https://maps.googleapis.com/maps/api/directions/json?language="+Ti.Locale.getCurrentLanguage()+"&sensor=false&mode="+r+"&origin="+g+","+i+"&destination="+l+","+s;return o.open("GET",u),o.send(),e},loadKML:function(){var e=arguments[0],a=Promise.defer(),t=Ti.Network.createHTTPClient({onload:function(){var e=((new Date).getTime(),{points:[],lines:[],polygons:[],statistics:null});parseAndRenderKML(this.responseXML.documentElement,e),a.resolve(e)},onerror:function(e){a.reject(e)}});return t.open("GET",e),t.send(),a},GaussKrueger2Geo:function(){var e=arguments[0]||{},t=e.rw,n=e.hw;return""==t||""==n?(lp="",void(bp="")):(t=parseFloat(t),n=parseFloat(n),a=6377397.155,f=.00334277321,pi=Math.PI,c=a/(1-f),ex2=(2*f-f*f)/((1-f)*(1-f)),ex4=ex2*ex2,ex6=ex4*ex2,ex8=ex4*ex4,e0=c*(pi/180)*(1-3*ex2/4+45*ex4/64-175*ex6/256+11025*ex8/16384),f2=180/pi*(3*ex2/8-3*ex4/16+213*ex6/2048-255*ex8/4096),f4=180/pi*(21*ex4/256-21*ex6/256+533*ex8/8192),f6=180/pi*(151*ex6/6144-453*ex8/12288),sigma=n/e0,sigmr=sigma*pi/180,bf=sigma+f2*Math.sin(2*sigmr)+f4*Math.sin(4*sigmr)+f6*Math.sin(6*sigmr),br=bf*pi/180,tan1=Math.tan(br),tan2=tan1*tan1,tan4=tan2*tan2,cos1=Math.cos(br),cos2=cos1*cos1,etasq=ex2*cos2,nd=c/Math.sqrt(1+etasq),nd2=nd*nd,nd4=nd2*nd2,nd6=nd4*nd2,nd3=nd2*nd,nd5=nd4*nd,kz=parseInt(t/1e6),lh=3*kz,dy=t-(1e6*kz+5e5),dy2=dy*dy,dy4=dy2*dy2,dy3=dy2*dy,dy5=dy4*dy,dy6=dy3*dy3,b2=-tan1*(1+etasq)/(2*nd2),b4=tan1*(5+3*tan2+6*etasq*(1-tan2))/(24*nd4),b6=-tan1*(61+90*tan2+45*tan4)/(720*nd6),l1=1/(nd*cos1),l3=-(1+2*tan2+etasq)/(6*nd3*cos1),l5=(5+28*tan2+24*tan4)/(120*nd5*cos1),bp=bf+180/pi*(b2*dy2+b4*dy4+b6*dy6),lp=lh+180/pi*(l1*dy+l3*dy3+l5*dy5),(5>lp||lp>16||46>bp||bp>56)&&(lp="",bp=""),{latitude:bp,longitude:lp})},getDistBearing:function(e,a,t,n){const r=(Math.PI,6371e3);var e=e.toRadians(),t=t.toRadians(),g=(t-e).toRadians(),i=(n-a).toRadians(),l=Math.sin(g/2)*Math.sin(g/2)+Math.cos(e)*Math.cos(t)*Math.sin(i/2)*Math.sin(i/2),s=Math.sin(n-a)*Math.cos(t),o=Math.cos(e)*Math.sin(t)-Math.sin(e)*Math.cos(t)*Math.cos(n-a);return{bearing:Math.atan2(s,o).toDegrees(),distance:2*r*Math.atan2(Math.sqrt(l),Math.sqrt(1-l))}},UTM2Geo:function(e,t,n){if(""==e||""==t||""==n)return e="",t="",void(n="");if(band=e.substr(2,1),e=parseFloat(e),t=parseFloat(t),n=parseFloat(n),a=6378137,f=.00335281068,pi=Math.PI,c=a/(1-f),ex2=(2*f-f*f)/((1-f)*(1-f)),ex4=ex2*ex2,ex6=ex4*ex2,ex8=ex4*ex4,e0=c*(pi/180)*(1-3*ex2/4+45*ex4/64-175*ex6/256+11025*ex8/16384),f2=180/pi*(3*ex2/8-3*ex4/16+213*ex6/2048-255*ex8/4096),f4=180/pi*(21*ex4/256-21*ex6/256+533*ex8/8192),f6=180/pi*(151*ex6/6144-453*ex8/12288),band>="N"||""==band)var r=n;else var r=n-1e7;sigma=r/.9996/e0,sigmr=sigma*pi/180,bf=sigma+f2*Math.sin(2*sigmr)+f4*Math.sin(4*sigmr)+f6*Math.sin(6*sigmr),br=bf*pi/180,tan1=Math.tan(br),tan2=tan1*tan1,tan4=tan2*tan2,cos1=Math.cos(br),cos2=cos1*cos1;var g=ex2*cos2;return nd=c/Math.sqrt(1+g),nd2=nd*nd,nd4=nd2*nd2,nd6=nd4*nd2,nd3=nd2*nd,nd5=nd4*nd,lh=6*(e-30)-3,dy=(t-5e5)/.9996,dy2=dy*dy,dy4=dy2*dy2,dy3=dy2*dy,dy5=dy3*dy2,dy6=dy3*dy3,b2=-tan1*(1+g)/(2*nd2),b4=tan1*(5+3*tan2+6*g*(1-tan2))/(24*nd4),b6=-tan1*(61+90*tan2+45*tan4)/(720*nd6),l1=1/(nd*cos1),l3=-(1+2*tan2+g)/(6*nd3*cos1),l5=(5+28*tan2+24*tan4)/(120*nd5*cos1),bw=bf+180/pi*(b2*dy2+b4*dy4+b6*dy6),lw=lh+180/pi*(l1*dy+l3*dy3+l5*dy5),{latitude:bw,longitude:lw}}};module.exports=Module;