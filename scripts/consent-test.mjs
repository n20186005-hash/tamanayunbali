import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const code=fs.readFileSync('src/components/Consent.astro','utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)[1];
const key='taman-ayun-analytics';
function setup({localFail=false,sessionFail=false,readFail=false,initial='granted'}={}) {
 const local=new Map([[key,initial]]),session=new Map(),appended=[],banner={hidden:true},current={textContent:''},status={textContent:''};
 const buttons=['denied','granted'].map(c=>({dataset:{consent:c},addEventListener(e,f){this[e]=f}}));
 const storage=(map,fail)=>({getItem:k=>{if(readFail)throw Error('blocked');return map.get(k)||null},setItem(k,v){if(fail)throw Error('blocked');map.set(k,v)},removeItem(k){if(fail)throw Error('blocked');map.delete(k)}});
 const c={localStorage:storage(local,localFail),sessionStorage:storage(session,sessionFail),Date,document:{head:{appendChild:s=>appended.push(s)},createElement:()=>({dataset:{}}),querySelector:q=>q==='[data-ga4]'?appended[0]||null:q==='[data-consent-banner]'?banner:current,querySelectorAll:q=>q==='[data-consent]'?buttons:[status]}};c.window=c;vm.createContext(c);vm.runInContext(code,c);return {c,local,session,appended,buttons,current,status};
}
for(const options of [{},{localFail:true},{localFail:true,sessionFail:true}]) {
 const x=setup(options);assert.equal(x.appended.length,1);x.buttons[0].click();assert.equal(x.c['ga-disable-G-HXM22WWPKP'],true);assert.equal(x.c.readTamanAnalytics(),'denied');assert.equal(x.c.dataLayer.at(-1)[2].analytics_storage,'denied');
 vm.runInContext(code,x.c);assert.equal(x.c.readTamanAnalytics(),'denied');assert.equal(x.appended.length,1);
 if(options.localFail&&!options.sessionFail){delete x.c.applyTamanAnalytics;vm.runInContext(code,x.c);assert.equal(x.c.readTamanAnalytics(),'denied');assert.equal(x.appended.length,1);}
 x.buttons[1].click();assert.equal(x.c['ga-disable-G-HXM22WWPKP'],false);assert.equal(x.c.dataLayer.at(-1)[2].analytics_storage,'granted');assert.equal(x.c.readTamanAnalytics(),'granted');assert.equal(x.appended.length,1);assert.match(x.current.textContent,/diizinkan/);
}
for(const options of [{initial:'denied'},{initial:'malformed'},{readFail:true}]){const x=setup(options);assert.equal(x.appended.length,0);x.buttons[0].click();assert.equal(x.c['ga-disable-G-HXM22WWPKP'],true);}
console.log('Consent VM passed: existing grant, immediate denial, old grant readable with local write blocked, both storage writes blocked, session veto navigation, re-entry, allow-deny-allow singleloader, blocked reads and malformed choice.');
const blocked=setup({initial:null,readFail:true,localFail:true,sessionFail:true});assert.equal(blocked.appended.length,0);blocked.buttons[1].click();assert.equal(blocked.appended.length,1);assert.match(blocked.status.textContent,/tidak dapat disimpan/);blocked.buttons[0].click();assert.equal(blocked.c['ga-disable-G-HXM22WWPKP'],true);assert.match(blocked.status.textContent,/tidak dapat disimpan/);
const localOnlyFail=setup({localFail:true});localOnlyFail.buttons[0].click();assert.match(localOnlyFail.status.textContent,/tab ini/);
console.log('First visit with all storage blocked: grant/refusal immediate, single loader and truthful status passed.');
