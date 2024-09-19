var C=Object.defineProperty;var j=(e,t,n)=>t in e?C(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n;var p=(e,t,n)=>j(e,typeof t!="symbol"?t+"":t,n);import{r as h,n as y,f as v,h as B,i as S,j as I,k as b,l as L,m as P,p as N,q as T,v as q,w as H}from"./scheduler.W2pu3yam.js";let $=!1;function M(){$=!0}function O(){$=!1}function z(e,t,n,r){for(;e<t;){const l=e+(t-e>>1);n(l)<=r?e=l+1:t=l}return e}function D(e){if(e.hydrate_init)return;e.hydrate_init=!0;let t=e.childNodes;if(e.nodeName==="HEAD"){const i=[];for(let a=0;a<t.length;a++){const o=t[a];o.claim_order!==void 0&&i.push(o)}t=i}const n=new Int32Array(t.length+1),r=new Int32Array(t.length);n[0]=-1;let l=0;for(let i=0;i<t.length;i++){const a=t[i].claim_order,o=(l>0&&t[n[l]].claim_order<=a?l+1:z(1,l,d=>t[n[d]].claim_order,a))-1;r[i]=n[o]+1;const f=o+1;n[f]=i,l=Math.max(f,l)}const u=[],s=[];let c=t.length-1;for(let i=n[l]+1;i!=0;i=r[i-1]){for(u.push(t[i-1]);c>=i;c--)s.push(t[c]);c--}for(;c>=0;c--)s.push(t[c]);u.reverse(),s.sort((i,a)=>i.claim_order-a.claim_order);for(let i=0,a=0;i<s.length;i++){for(;a<u.length&&s[i].claim_order>=u[a].claim_order;)a++;const o=a<u.length?u[a]:null;e.insertBefore(s[i],o)}}function R(e,t){if($){for(D(e),(e.actual_end_child===void 0||e.actual_end_child!==null&&e.actual_end_child.parentNode!==e)&&(e.actual_end_child=e.firstChild);e.actual_end_child!==null&&e.actual_end_child.claim_order===void 0;)e.actual_end_child=e.actual_end_child.nextSibling;t!==e.actual_end_child?(t.claim_order!==void 0||t.parentNode!==e)&&e.insertBefore(t,e.actual_end_child):e.actual_end_child=t.nextSibling}else(t.parentNode!==e||t.nextSibling!==null)&&e.appendChild(t)}function te(e,t,n){$&&!n?R(e,t):(t.parentNode!==e||t.nextSibling!=n)&&e.insertBefore(t,n||null)}function U(e){e.parentNode&&e.parentNode.removeChild(e)}function V(e){return document.createElement(e)}function W(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function x(e){return document.createTextNode(e)}function ne(){return x(" ")}function ie(){return x("")}function re(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function ae(e,t,n){n==null?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function se(e,t,n){e.setAttributeNS("http://www.w3.org/1999/xlink",t,n)}function le(e){return e.dataset.svelteH}function k(e){return Array.from(e.childNodes)}function F(e){e.claim_info===void 0&&(e.claim_info={last_index:0,total_claimed:0})}function A(e,t,n,r,l=!1){F(e);const u=(()=>{for(let s=e.claim_info.last_index;s<e.length;s++){const c=e[s];if(t(c)){const i=n(c);return i===void 0?e.splice(s,1):e[s]=i,l||(e.claim_info.last_index=s),c}}for(let s=e.claim_info.last_index-1;s>=0;s--){const c=e[s];if(t(c)){const i=n(c);return i===void 0?e.splice(s,1):e[s]=i,l?i===void 0&&e.claim_info.last_index--:e.claim_info.last_index=s,c}}return r()})();return u.claim_order=e.claim_info.total_claimed,e.claim_info.total_claimed+=1,u}function E(e,t,n,r){return A(e,l=>l.nodeName===t,l=>{const u=[];for(let s=0;s<l.attributes.length;s++){const c=l.attributes[s];n[c.name]||u.push(c.name)}u.forEach(s=>l.removeAttribute(s))},()=>r(t))}function ce(e,t,n){return E(e,t,n,V)}function ue(e,t,n){return E(e,t,n,W)}function G(e,t){return A(e,n=>n.nodeType===3,n=>{const r=""+t;if(n.data.startsWith(r)){if(n.data.length!==r.length)return n.splitText(r.length)}else n.data=r},()=>x(t),!0)}function fe(e){return G(e," ")}function oe(e,t){t=""+t,e.data!==t&&(e.data=t)}function _e(e,t,n,r){n==null?e.style.removeProperty(t):e.style.setProperty(t,n,"")}function de(e,t){return new e(t)}const m=new Set;let _;function me(){_={r:0,c:[],p:_}}function he(){_.r||h(_.c),_=_.p}function J(e,t){e&&e.i&&(m.delete(e),e.i(t))}function $e(e,t,n,r){if(e&&e.o){if(m.has(e))return;m.add(e),_.c.push(()=>{m.delete(e),r&&(n&&e.d(1),r())}),e.o(t)}else r&&r()}function pe(e){e&&e.c()}function ye(e,t){e&&e.l(t)}function K(e,t,n){const{fragment:r,after_update:l}=e.$$;r&&r.m(t,n),b(()=>{const u=e.$$.on_mount.map(T).filter(S);e.$$.on_destroy?e.$$.on_destroy.push(...u):h(u),e.$$.on_mount=[]}),l.forEach(b)}function Q(e,t){const n=e.$$;n.fragment!==null&&(L(n.after_update),h(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function X(e,t){e.$$.dirty[0]===-1&&(q.push(e),H(),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function xe(e,t,n,r,l,u,s=null,c=[-1]){const i=P;N(e);const a=e.$$={fragment:null,ctx:[],props:u,update:y,not_equal:l,bound:v(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(t.context||(i?i.$$.context:[])),callbacks:v(),dirty:c,skip_bound:!1,root:t.target||i.$$.root};s&&s(a.root);let o=!1;if(a.ctx=n?n(e,t.props||{},(f,d,...w)=>{const g=w.length?w[0]:d;return a.ctx&&l(a.ctx[f],a.ctx[f]=g)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](g),o&&X(e,f)),d}):[],a.update(),o=!0,h(a.before_update),a.fragment=r?r(a.ctx):!1,t.target){if(t.hydrate){M();const f=k(t.target);a.fragment&&a.fragment.l(f),f.forEach(U)}else a.fragment&&a.fragment.c();t.intro&&J(e.$$.fragment),K(e,t.target,t.anchor),O(),B()}N(i)}class we{constructor(){p(this,"$$");p(this,"$$set")}$destroy(){Q(this,1),this.$destroy=y}$on(t,n){if(!S(n))return y;const r=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return r.push(n),()=>{const l=r.indexOf(n);l!==-1&&r.splice(l,1)}}$set(t){this.$$set&&!I(t)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const Y="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(Y);export{W as A,ue as B,se as C,we as S,$e as a,k as b,ce as c,U as d,V as e,te as f,x as g,G as h,xe as i,fe as j,R as k,oe as l,ie as m,he as n,ae as o,_e as p,me as q,de as r,ne as s,J as t,pe as u,ye as v,K as w,Q as x,le as y,re as z};
