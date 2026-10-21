import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const code=fs.readFileSync('src/components/Consent.astro','utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const key='taman-ayun-analytics';
function setup({localFail=false,sessionFail=false,readFail=false,initial='granted',sessionReadFail=false,removeFail=false,shared}={}) {
 const local=shared||new Map([[key,initial]]),session=new Map(),appended=[],banner={hidden:true},current={textContent:''},status={textContent:''};
 const buttons=['denied','granted'].map(c=>({dataset:{consent:c},addEventListener(e,f){this[e]=f}}));
 const storage=(map,fail,isSession=false)=>({getItem:k=>{if(readFail||(isSession&&sessionReadFail))throw Error('blocked');return map.get(k)||null},setItem(k,v){if(fail)throw Error('blocked');map.set(k,v)},removeItem(k){if(fail||(isSession&&removeFail))throw Error('blocked');map.delete(k)}});
 const listeners={};const c={Event:class{constructor(type){this.type=type}},addEventListener:(type,fn)=>(listeners[type]||=[]).push(fn),dispatchEvent:event=>(listeners[event.type]||[]).forEach(fn=>fn(event)),localStorage:storage(local,localFail),sessionStorage:storage(session,sessionFail,true),Date,document:{head:{appendChild:s=>appended.push(s)},createElement:()=>({dataset:{}}),querySelector:q=>q==='[data-ga4]'?appended[0]||null:q==='[data-consent-banner]'?banner:current,querySelectorAll:q=>q==='[data-consent]'?buttons:[status]}};c.window=c;vm.createContext(c);vm.runInContext(code,c);return {c,local,session,appended,buttons,current,status};
}
for(const options of [{},{localFail:true},{localFail:true,sessionFail:true}]) {
 const x=setup(options);assert.equal(x.appended.length,1);x.buttons[0].click();assert.equal(x.c['ga-disable-G-HXM22WWPKP'],true);assert.equal(x.c.readTamanAnalytics(),'denied');assert.equal(x.c.dataLayer.at(-1)[2].analytics_storage,'denied');
 vm.runInContext(code,x.c);assert.equal(x.c.readTamanAnalytics(),'denied');assert.equal(x.appended.length,1);
 if(options.localFail&&!options.sessionFail){delete x.c.applyTamanAnalytics;vm.runInContext(code,x.c);assert.equal(x.c.readTamanAnalytics(),'denied');assert.equal(x.appended.length,1);}
 x.buttons[1].click();assert.equal(x.c['ga-disable-G-HXM22WWPKP'],false);assert.equal(x.c.dataLayer.at(-1)[2].analytics_storage,'granted');assert.equal(x.c.readTamanAnalytics(),'granted');assert.equal(x.appended.length,1);assert.match(x.current.textContent,/diizinkan/);
}
for(const options of [{initial:'denied'},{initial:'malformed'},{readFail:true}]){const x=setup(options);assert.equal(x.appended.length,0);x.buttons[0].click();assert.equal(x.c['ga-disable-G-HXM22WWPKP'],true);}
console.log('Consent VM passed: existing grant, immediate denial, old grant readable with local write blocked, both storage writes blocked, session veto navigation, re-entry, allow-deny-allow singleloader, blocked reads and malformed choice.');
const blocked=setup({initial:null,readFail:true,localFail:true,sessionFail:true});assert.equal(blocked.appended.length,0);blocked.buttons[1].click();assert.equal(blocked.appended.length,0);assert.match(blocked.status.textContent,/tidak dapat disimpan/);blocked.buttons[0].click();assert.equal(blocked.c['ga-disable-G-HXM22WWPKP'],true);assert.match(blocked.status.textContent,/tidak dapat disimpan/);
const localOnlyFail=setup({localFail:true});localOnlyFail.buttons[0].click();assert.match(localOnlyFail.status.textContent,/tab ini/);
console.log('First visit with all storage blocked: unreadable veto prevents grant; refusal immediate and truthful status passed.');

const unreadable=setup({sessionReadFail:true});assert.equal(unreadable.appended.length,0);assert.equal(unreadable.c['ga-disable-G-HXM22WWPKP'],true);
const retained=setup({removeFail:true});retained.buttons[0].click();retained.buttons[1].click();assert.equal(retained.c.readTamanAnalytics(),'denied');assert.equal(retained.local.get(key),'denied');assert.equal(retained.c['ga-disable-G-HXM22WWPKP'],true);assert.match(retained.current.textContent,/dinonaktifkan/);
const shared=new Map([[key,'granted']]),tabA=setup({shared}),tabB=setup({shared});tabB.buttons[0].click();tabA.c.dispatchEvent({type:'storage',key,newValue:shared.get(key)});assert.equal(tabA.c.readTamanAnalytics(),'denied');assert.equal(tabA.c['ga-disable-G-HXM22WWPKP'],true);assert.equal(tabA.c.dataLayer.at(-1)[2].analytics_storage,'denied');assert.match(tabA.current.textContent,/dinonaktifkan/);shared.set(key,'granted');tabA.c.dispatchEvent({type:'storage',key,newValue:'granted'});assert.equal(tabA.c.readTamanAnalytics(),'denied');assert.equal(tabA.appended.length,1);
console.log('Follow-up actual-inline fixtures passed: readable grant/unreadable session failclosed; failed retained-veto removal cannot share new grant; shared-local independent-session tabs storage denial updates runtime/UI; external grant cannot undo document veto.');
