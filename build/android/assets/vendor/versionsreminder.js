var versionCompare=function(e,a){var t,n,r,i=(""+e).split("."),s=(""+a).split("."),l=Math.min(i.length,s.length);for(r=0;l>r;r++)if(t=r?parseFloat("0."+i[r],10):parseInt(i[r],10),n=r?parseFloat("0."+s[r],10):parseInt(s[r],10),isNaN(t)&&(t=i[r]),isNaN(n)&&(n=s[r]),t!=n)return t>n?1:n>t?-1:0/0;return i.length===s.length?0:i.length<s.length?-1:1};module.exports=function(){var e=Ti.App.getVersion(),a=(arguments[0]||{},"https://play.google.com/store/apps/details?id="+Ti.App.getId()),t=Ti.Network.createHTTPClient({onerror:function(){console.log("Warning: no connection to playstore "+e)},onload:function(){var t=/itemprop="softwareVersion">(.*?)</m.exec(this.responseText);if(!t)return void console.log("Warning: no connection to playstore "+e);var n=t[1].replace(/\s+/g,"");switch(console.log("Store=["+n+"] app=["+Ti.App.getVersion()+"]"),versionCompare(Ti.App.getVersion(),n)){case-1:var r=Ti.UI.createAlertDialog({cancel:1,buttonNames:["Zum Store","Abbruch"],message:"Es gibt eine neue Version im Playstore.\n\nDiese App auf dem "+Ti.Platform.model+" hat die Version "+Ti.App.getVersion()+"\n\nIm Store ist  "+n+".\n\nMöchtest Du erneuern?",title:"Neue Version „"+Ti.App.getName()+"“"});r.show(),r.addEventListener("click",function(e){e.index!=e.source.cancel&&Ti.Platform.openURL(a)});break;case 1:Ti.Android&&Ti.UI.createNotification({message:Ti.App.getName()+" ist neuer als neu … ("+Ti.App.getVersion()+")"}).show();break;case 0:break;default:console.log("Warning: versions compare has error")}}});t.open("GET",a),t.send()};