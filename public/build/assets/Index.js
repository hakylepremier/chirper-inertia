import{g as K,c as X,q as it,r as ot,W as tt,j as o,a as ut}from"./app.js";import{D as Q,A as ct}from"./AuthenticatedLayout.js";import{I as et}from"./InputError.js";import{P as rt}from"./PrimaryButton.js";import"./ApplicationLogo.js";import"./transition.js";var st={exports:{}};(function($,I){(function(D,x){$.exports=x()})(X,function(){var D=1e3,x=6e4,N=36e5,v="millisecond",b="second",j="minute",S="hour",u="day",p="week",l="month",H="quarter",_="year",C="date",T="Invalid Date",z=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,F=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,U={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(n){var r=["th","st","nd","rd"],t=n%100;return"["+n+(r[(t-20)%10]||r[t]||r[0])+"]"}},J=function(n,r,t){var s=String(n);return!s||s.length>=r?n:""+Array(r+1-s.length).join(t)+n},E={s:J,z:function(n){var r=-n.utcOffset(),t=Math.abs(r),s=Math.floor(t/60),e=t%60;return(r<=0?"+":"-")+J(s,2,"0")+":"+J(e,2,"0")},m:function n(r,t){if(r.date()<t.date())return-n(t,r);var s=12*(t.year()-r.year())+(t.month()-r.month()),e=r.clone().add(s,l),a=t-e<0,i=r.clone().add(s+(a?-1:1),l);return+(-(s+(t-e)/(a?e-i:i-e))||0)},a:function(n){return n<0?Math.ceil(n)||0:Math.floor(n)},p:function(n){return{M:l,y:_,w:p,d:u,D:C,h:S,m:j,s:b,ms:v,Q:H}[n]||String(n||"").toLowerCase().replace(/s$/,"")},u:function(n){return n===void 0}},y="en",M={};M[y]=U;var W="$isDayjsObject",L=function(n){return n instanceof q||!(!n||!n[W])},V=function n(r,t,s){var e;if(!r)return y;if(typeof r=="string"){var a=r.toLowerCase();M[a]&&(e=a),t&&(M[a]=t,e=a);var i=r.split("-");if(!e&&i.length>1)return n(i[0])}else{var d=r.name;M[d]=r,e=d}return!s&&e&&(y=e),e||!s&&y},h=function(n,r){if(L(n))return n.clone();var t=typeof r=="object"?r:{};return t.date=n,t.args=arguments,new q(t)},c=E;c.l=V,c.i=L,c.w=function(n,r){return h(n,{locale:r.$L,utc:r.$u,x:r.$x,$offset:r.$offset})};var q=function(){function n(t){this.$L=V(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[W]=!0}var r=n.prototype;return r.parse=function(t){this.$d=function(s){var e=s.date,a=s.utc;if(e===null)return new Date(NaN);if(c.u(e))return new Date;if(e instanceof Date)return new Date(e);if(typeof e=="string"&&!/Z$/i.test(e)){var i=e.match(z);if(i){var d=i[2]-1||0,f=(i[7]||"0").substring(0,3);return a?new Date(Date.UTC(i[1],d,i[3]||1,i[4]||0,i[5]||0,i[6]||0,f)):new Date(i[1],d,i[3]||1,i[4]||0,i[5]||0,i[6]||0,f)}}return new Date(e)}(t),this.init()},r.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},r.$utils=function(){return c},r.isValid=function(){return this.$d.toString()!==T},r.isSame=function(t,s){var e=h(t);return this.startOf(s)<=e&&e<=this.endOf(s)},r.isAfter=function(t,s){return h(t)<this.startOf(s)},r.isBefore=function(t,s){return this.endOf(s)<h(t)},r.$g=function(t,s,e){return c.u(t)?this[s]:this.set(e,t)},r.unix=function(){return Math.floor(this.valueOf()/1e3)},r.valueOf=function(){return this.$d.getTime()},r.startOf=function(t,s){var e=this,a=!!c.u(s)||s,i=c.p(t),d=function(B,w){var O=c.w(e.$u?Date.UTC(e.$y,w,B):new Date(e.$y,w,B),e);return a?O:O.endOf(u)},f=function(B,w){return c.w(e.toDate()[B].apply(e.toDate("s"),(a?[0,0,0,0]:[23,59,59,999]).slice(w)),e)},m=this.$W,g=this.$M,k=this.$D,A="set"+(this.$u?"UTC":"");switch(i){case _:return a?d(1,0):d(31,11);case l:return a?d(1,g):d(0,g+1);case p:var Y=this.$locale().weekStart||0,Z=(m<Y?m+7:m)-Y;return d(a?k-Z:k+(6-Z),g);case u:case C:return f(A+"Hours",0);case S:return f(A+"Minutes",1);case j:return f(A+"Seconds",2);case b:return f(A+"Milliseconds",3);default:return this.clone()}},r.endOf=function(t){return this.startOf(t,!1)},r.$set=function(t,s){var e,a=c.p(t),i="set"+(this.$u?"UTC":""),d=(e={},e[u]=i+"Date",e[C]=i+"Date",e[l]=i+"Month",e[_]=i+"FullYear",e[S]=i+"Hours",e[j]=i+"Minutes",e[b]=i+"Seconds",e[v]=i+"Milliseconds",e)[a],f=a===u?this.$D+(s-this.$W):s;if(a===l||a===_){var m=this.clone().set(C,1);m.$d[d](f),m.init(),this.$d=m.set(C,Math.min(this.$D,m.daysInMonth())).$d}else d&&this.$d[d](f);return this.init(),this},r.set=function(t,s){return this.clone().$set(t,s)},r.get=function(t){return this[c.p(t)]()},r.add=function(t,s){var e,a=this;t=Number(t);var i=c.p(s),d=function(g){var k=h(a);return c.w(k.date(k.date()+Math.round(g*t)),a)};if(i===l)return this.set(l,this.$M+t);if(i===_)return this.set(_,this.$y+t);if(i===u)return d(1);if(i===p)return d(7);var f=(e={},e[j]=x,e[S]=N,e[b]=D,e)[i]||1,m=this.$d.getTime()+t*f;return c.w(m,this)},r.subtract=function(t,s){return this.add(-1*t,s)},r.format=function(t){var s=this,e=this.$locale();if(!this.isValid())return e.invalidDate||T;var a=t||"YYYY-MM-DDTHH:mm:ssZ",i=c.z(this),d=this.$H,f=this.$m,m=this.$M,g=e.weekdays,k=e.months,A=e.meridiem,Y=function(w,O,P,G){return w&&(w[O]||w(s,a))||P[O].slice(0,G)},Z=function(w){return c.s(d%12||12,w,"0")},B=A||function(w,O,P){var G=w<12?"AM":"PM";return P?G.toLowerCase():G};return a.replace(F,function(w,O){return O||function(P){switch(P){case"YY":return String(s.$y).slice(-2);case"YYYY":return c.s(s.$y,4,"0");case"M":return m+1;case"MM":return c.s(m+1,2,"0");case"MMM":return Y(e.monthsShort,m,k,3);case"MMMM":return Y(k,m);case"D":return s.$D;case"DD":return c.s(s.$D,2,"0");case"d":return String(s.$W);case"dd":return Y(e.weekdaysMin,s.$W,g,2);case"ddd":return Y(e.weekdaysShort,s.$W,g,3);case"dddd":return g[s.$W];case"H":return String(d);case"HH":return c.s(d,2,"0");case"h":return Z(1);case"hh":return Z(2);case"a":return B(d,f,!0);case"A":return B(d,f,!1);case"m":return String(f);case"mm":return c.s(f,2,"0");case"s":return String(s.$s);case"ss":return c.s(s.$s,2,"0");case"SSS":return c.s(s.$ms,3,"0");case"Z":return i}return null}(w)||i.replace(":","")})},r.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},r.diff=function(t,s,e){var a,i=this,d=c.p(s),f=h(t),m=(f.utcOffset()-this.utcOffset())*x,g=this-f,k=function(){return c.m(i,f)};switch(d){case _:a=k()/12;break;case l:a=k();break;case H:a=k()/3;break;case p:a=(g-m)/6048e5;break;case u:a=(g-m)/864e5;break;case S:a=g/N;break;case j:a=g/x;break;case b:a=g/D;break;default:a=g}return e?a:c.a(a)},r.daysInMonth=function(){return this.endOf(l).$D},r.$locale=function(){return M[this.$L]},r.locale=function(t,s){if(!t)return this.$L;var e=this.clone(),a=V(t,s,!0);return a&&(e.$L=a),e},r.clone=function(){return c.w(this.$d,this)},r.toDate=function(){return new Date(this.valueOf())},r.toJSON=function(){return this.isValid()?this.toISOString():null},r.toISOString=function(){return this.$d.toISOString()},r.toString=function(){return this.$d.toUTCString()},n}(),R=q.prototype;return h.prototype=R,[["$ms",v],["$s",b],["$m",j],["$H",S],["$W",u],["$M",l],["$y",_],["$D",C]].forEach(function(n){R[n[1]]=function(r){return this.$g(r,n[0],n[1])}}),h.extend=function(n,r){return n.$i||(n(r,q,h),n.$i=!0),h},h.locale=V,h.isDayjs=L,h.unix=function(n){return h(1e3*n)},h.en=M[y],h.Ls=M,h.p={},h})})(st);var dt=st.exports;const nt=K(dt);var at={exports:{}};(function($,I){(function(D,x){$.exports=x()})(X,function(){return function(D,x,N){D=D||{};var v=x.prototype,b={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function j(u,p,l,H){return v.fromToBase(u,p,l,H)}N.en.relativeTime=b,v.fromToBase=function(u,p,l,H,_){for(var C,T,z,F=l.$locale().relativeTime||b,U=D.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],J=U.length,E=0;E<J;E+=1){var y=U[E];y.d&&(C=H?N(u).diff(l,y.d,!0):l.diff(u,y.d,!0));var M=(D.rounding||Math.round)(Math.abs(C));if(z=C>0,M<=y.r||!y.r){M<=1&&E>0&&(y=U[E-1]);var W=F[y.l];_&&(M=_(""+M)),T=typeof W=="string"?W.replace("%d",M):W(M,p,y.l,z);break}}if(p)return T;var L=z?F.future:F.past;return typeof L=="function"?L(T):L.replace("%s",T)},v.to=function(u,p){return j(u,p,this,!0)},v.from=function(u,p){return j(u,p,this)};var S=function(u){return u.$u?N.utc():N()};v.toNow=function(u){return this.to(S(this),u)},v.fromNow=function(u){return this.from(S(this),u)}}})})(at);var lt=at.exports;const ft=K(lt);nt.extend(ft);function ht({chirp:$}){const{auth:I}=it().props,[D,x]=ot.useState(!1),{data:N,setData:v,patch:b,clearErrors:j,reset:S,errors:u}=tt({message:$.message}),p=l=>{l.preventDefault(),b(route("chirps.update",$.id),{onSuccess:()=>x(!1)})};return o.jsxs("div",{className:"p-6 flex space-x-2 text-white dark:border-[#427D9D]",children:[o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-6 w-6 text-[#9BBEC8] -scale-x-100",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"2",children:o.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"})}),o.jsxs("div",{className:"flex-1",children:[o.jsxs("div",{className:"flex justify-between items-center",children:[o.jsxs("div",{children:[o.jsx("span",{className:"text-[#9BBEC8]",children:$.user.name}),o.jsx("small",{className:"ml-2 text-sm text-[#427D9D] ",children:nt($.created_at).fromNow()}),$.created_at!==$.updated_at&&o.jsx("small",{className:"text-sm  text-[#427D9D]",children:" · edited"})]}),$.user.id===I.user.id&&o.jsxs(Q,{children:[o.jsx(Q.Trigger,{children:o.jsx("button",{children:o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-4 w-4 text-[#9BBEC8]",viewBox:"0 0 20 20",fill:"currentColor",children:o.jsx("path",{d:"M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"})})})}),o.jsxs(Q.Content,{children:[o.jsx("button",{className:"block w-full px-4 py-2 text-left text-sm leading-5 text-white dark:hover:bg-gray-800  focus:bg-gray-100 transition duration-150 ease-in-out",onClick:()=>x(!0),children:"Edit"}),o.jsx(Q.Link,{as:"button",href:route("chirps.destroy",$.id),method:"delete",children:"Delete"})]})]})]}),D?o.jsxs("form",{onSubmit:p,children:[o.jsx("textarea",{value:N.message,onChange:l=>v("message",l.target.value),className:"mt-4 w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm dark:bg-gray-800 text-white dark:border-gray-700"}),o.jsx(et,{message:u.message,className:"mt-2"}),o.jsxs("div",{className:"space-x-2",children:[o.jsx(rt,{className:"mt-4",children:"Save"}),o.jsx("button",{className:"mt-4",onClick:()=>{x(!1),S(),j()},children:"Cancel"})]})]}):o.jsx("p",{className:"mt-4 text-lg text-[#DDF2FD]",children:$.message})]})]})}function yt({auth:$,chirps:I}){const{data:D,setData:x,post:N,processing:v,reset:b,errors:j}=tt({message:""}),S=u=>{u.preventDefault(),N(route("chirps.store"),{onSuccess:()=>b()})};return o.jsxs(ct,{user:$.user,children:[o.jsx(ut,{title:"Chirps"}),o.jsxs("div",{className:"max-w-2xl mx-auto p-4 sm:p-6 lg:p-8",children:[o.jsxs("form",{onSubmit:S,children:[o.jsx("textarea",{value:D.message,placeholder:"What's on your mind?",className:"block w-full border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm dark:bg-gray-800 text-white dark:border-gray-700",onChange:u=>x("message",u.target.value)}),o.jsx(et,{message:j.message,className:"mt-2"}),o.jsx(rt,{className:"mt-4",disabled:v,children:"Chirp"})]}),o.jsxs("div",{className:"mt-6 shadow-sm rounded-lg divide-y bg-[#164863]",children:[" ",I.map(u=>o.jsx(ht,{chirp:u},u.id))]})]})]})}export{yt as default};