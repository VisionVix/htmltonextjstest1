// @ts-nocheck
/* eslint-disable */
"use client"

import Image from "next/image"
import Link from "next/link"
import Script from "next/script"

export default function HomePage() {
  return (
    <>
      <Script src="/page-scripts.js" strategy="afterInteractive" />
      <div className="app">
      
      {/* TOPBAR */}
      <div className="topbar">
        <span className="logo-text">HTML ↔ Next.js</span>
        <span className="badge badge-b">HTML → Next.js</span>
        <span style={{color:"var(--muted)",fontSize:"12px"}}>+</span>
        <span className="badge badge-p">Next.js → HTML</span>
        <div className="tsep"></div>
        <span className="tsub">Bidirectional converter — no API key needed</span>
      </div>
      
      {/* TABS */}
      <div className="tabs">
        <div className="tab tab-bl" id="t1" onClick={() => { sw('h2n') }}>▲ HTML → Next.js</div>
        <div className="tab" id="t2" onClick={() => { sw('n2h') }}>🌐 Next.js → HTML</div>
      </div>
      
      <div className="main">
      
      {/* ═══ PANEL A: HTML → NEXT.JS ═══ */}
      <div id="pa" className="panel on">
        <div className="sidebar">
          <div className="sec">
            <div className="lbl">HTML Input</div>
            <div className="dz" id="a-dz">
              <input type="file" accept=".html,.zip" multiple id="a-fi" />
              <div className="dz-ico">📄</div>
              <div className="dz-lbl">Drop .html or .zip files<br />or click to browse</div>
              <div className="dz-sub">Zip files are auto-extracted</div>
            </div>
            <div className="chips" id="a-chips"></div>
            <div className="or">or paste HTML</div>
            <textarea className="ta" id="a-paste" placeholder="<!DOCTYPE html>&#10;..."></textarea>
            <div className="hint">Pasted HTML → treated as <code>index.html</code></div>
          </div>
          <div className="sec">
            <div className="lbl">Project Name</div>
            <input className="ifield mono" id="a-proj" value="my-next-app" />
          </div>
          <div className="sec">
            <div className="ibox">Converts to <code>app/page.tsx</code>, extracts CSS → <code>globals.css</code>, CDN → <code>layout.tsx</code>. No API needed.</div>
          </div>
          <div className="sec">
            <button className="abtn bl" id="a-cvt" onClick={() => { aStart() }}>▲ Convert to Next.js</button>
            <button className="abtn gr" id="a-dl" onClick={() => { aDL() }}>↓ Download ZIP</button>
            <button className="cbtn" onClick={() => { aClear() }}>Clear</button>
          </div>
        </div>
        <div className="op">
          <div className="op-hdr">
            <span className="op-title" id="a-ot">Output</span>
            <span className="op-meta" id="a-om"></span>
          </div>
          <div className="op-body" id="a-ob">
            <div className="es" id="a-es">
              <div className="es-ico">▲</div>
              <div className="es-title">HTML → Next.js</div>
              <div className="es-sub">Upload or paste HTML files, set a project name, then convert to a full App Router project.</div>
            </div>
            <div className="pw" id="a-pw"><div className="pb-bg"><div className="pb bl" id="a-pb" style={{width:"0%"}}></div></div><div className="plog" id="a-pl"></div></div>
            <div className="rc gr" id="a-rc"></div>
            <div id="a-tree"></div>
            <div id="a-prev"></div>
          </div>
        </div>
      </div>
      
      {/* ═══ PANEL B: NEXT.JS → HTML ═══ */}
      <div id="pb" className="panel">
        <div className="sidebar">
          <div className="sec">
            <div className="lbl">Next.js Files</div>
            <div className="dz pu" id="b-dz">
              <input type="file" accept=".tsx,.ts,.jsx,.js,.css,.zip" multiple id="b-fi" />
              <div className="dz-ico">⚛</div>
              <div className="dz-lbl">Drop .tsx / .jsx / .zip<br />files or click</div>
              <div className="dz-sub">Zip files are auto-extracted</div>
            </div>
            <div className="chips" id="b-chips"></div>
            <div className="or">or paste TSX/JSX</div>
            <textarea className="ta" id="b-paste" placeholder="export default function Page() {&#10;  return <div>Hello</div>&#10;}"></textarea>
            <div className="hint">Pasted TSX → treated as <code>page.tsx</code></div>
          </div>
          <div className="sec">
            <div className="lbl">globals.css (optional)</div>
            <textarea className="ta" id="b-css" style={{height:"65px"}} placeholder="body { margin:0; }&#10;.container { ... }"></textarea>
            <div className="hint">Inlined into <code>&lt;style&gt;</code> in output</div>
          </div>
          <div className="sec">
            <div className="lbl">Output Filename</div>
            <input className="ifield mono" id="b-out" value="index" placeholder="index" />
            <div className="hint">Output → <code>&lt;name&gt;.html</code></div>
          </div>
          <div className="sec">
            <div className="ibox pu">Reverses JSX: <code>className→class</code>, event handlers, <code>style&#123;&#123;&#125;&#125;→style=""</code>. Inlines CSS &amp; restores CDN links.</div>
          </div>
          <div className="sec">
            <button className="abtn pu" id="b-cvt" onClick={() => { bStart() }}>🌐 Convert to HTML</button>
            <button className="abtn gr" id="b-dl" onClick={() => { bDL() }}>↓ Download HTML</button>
            <button className="cbtn" onClick={() => { bClear() }}>Clear</button>
          </div>
        </div>
        <div className="op">
          <div className="op-hdr">
            <span className="op-title" id="b-ot">Output</span>
            <span className="op-meta" id="b-om"></span>
          </div>
          <div className="op-body" id="b-ob">
            <div className="es" id="b-es">
              <div className="es-ico">🌐</div>
              <div className="es-title">Next.js → HTML</div>
              <div className="es-sub">Drop .tsx/.jsx files (page, layout, components), paste globals.css, and get a standalone HTML file you can open in any browser.</div>
            </div>
            <div className="pw" id="b-pw"><div className="pb-bg"><div className="pb pu" id="b-pb" style={{width:"0%"}}></div></div><div className="plog" id="b-pl"></div></div>
            <div className="rc pu" id="b-rc"></div>
            <div id="b-tree"></div>
            <div id="b-prev"></div>
          </div>
        </div>
      </div>
      
      </div>{/* /main */}
      </div>{/* /app */}
      
      <script>
      // ═══ UTILS ═══
      function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
      function sleep(ms){ return new Promise(function(r){ setTimeout(r,ms); }); }
      function fmtSz(b){ return b<1024?b+'B':Math.round(b/1024*10)/10+'KB'; }
      function ficon(ext){ var m={tsx:'⚛',ts:'📘',jsx:'⚛',js:'📜',json:'{}',css:'🎨',md:'📝',html:'🌐',gitignore:'🙈'}; return m[ext]||'📄'; }
      
      // ═══ TABS ═══
      function sw(mode){
        document.getElementById('pa').className='panel'+(mode==='h2n'?' on':'');
        document.getElementById('pb').className='panel'+(mode==='n2h'?' on':'');
        document.getElementById('t1').className='tab'+(mode==='h2n'?' tab-bl':'');
        document.getElementById('t2').className='tab'+(mode==='n2h'?' tab-pu':'');
      }
      
      // ═══ DROPZONE FACTORY ═══
      function mkDz(dzId,inpId,cb){
        var dz=document.getElementById(dzId), inp=document.getElementById(inpId);
        dz.addEventListener('dragover',function(e){ e.preventDefault(); dz.classList.add('over'); });
        dz.addEventListener('dragleave',function(){ dz.classList.remove('over'); });
        dz.addEventListener('drop',function(e){ e.preventDefault(); dz.classList.remove('over'); cb(e.dataTransfer.files); });
        inp.addEventListener('change',function(){ cb(inp.files); inp.value=''; });
      }
      
      function readFiles(files, exts, arr, chipsId){
        for(var i=0;i<files.length;i++){
          var f=files[i]; var ext=f.name.split('.').pop().toLowerCase();
          if(ext==='zip'){ extractZip(f,exts,arr,chipsId); continue; }
          if(!exts.includes(ext)) continue;
          (function(file){
            var r=new FileReader();
            r.onload=function(e){
              if(arr.some(function(x){ return x.name===file.name; })) return;
              arr.push({ name:file.name, content:e.target.result });
              renderChips(arr,chipsId);
            };
            r.readAsText(file);
          })(f);
        }
      }
      
      function extractZip(file, exts, arr, chipsId){
        var r=new FileReader();
        r.onload=function(e){
          JSZip.loadAsync(e.target.result).then(function(zip){
            var promises=[];
            zip.forEach(function(relPath,zipEntry){
              if(zipEntry.dir) return;
              var lower=relPath.toLowerCase();
              if(lower.includes('node_modules/')||lower.includes('.next/')||lower.includes('dist/')||lower.includes('.git/')) return;
              var ext=relPath.split('.').pop().toLowerCase();
              if(!exts.includes(ext)) return;
              promises.push(
                zipEntry.async('string').then(function(content){
                  if(!arr.some(function(x){ return x.name===relPath; })){
                    arr.push({ name:relPath, content:content });
                  }
                })
              );
            });
            Promise.all(promises).then(function(){ renderChips(arr,chipsId); });
          }).catch(function(err){ alert('Could not read zip: '+err.message); });
        };
        r.readAsArrayBuffer(file);
      }
      
      function renderChips(arr,id){
        var c=document.getElementById(id); c.innerHTML='';
        arr.forEach(function(f,i){
          var displayName=f.name.split('/').pop(); // show just filename
          var fullPath=f.name.includes('/')?f.name:'';
          var d=document.createElement('div'); d.className='chip';
          d.innerHTML='<span className="chip-ico">'+ficon(f.name.split('.').pop())+'</span>'
            +'<span className="chip-name" title="'+esc(f.name)+'">'+esc(displayName)+'</span>'
            +'<span className="chip-size">'+fmtSz(f.content.length)+'</span>'
            +'<button className="chip-del">✕</button>';
          d.querySelector('button').onclick=(function(idx){ return function(){ arr.splice(idx,1); renderChips(arr,id); }; })(i);
          c.appendChild(d);
        });
      }
      
      function lg(logId,msg,cls){
        var el=document.getElementById(logId);
        var line=document.createElement('div'); line.className='ll'+(cls?' '+cls:''); line.innerHTML=msg;
        el.appendChild(line); el.scrollTop=el.scrollHeight;
      }
      function setBar(id,pct){ document.getElementById(id).style.width=pct+'%'; }
      
      function renderTree(genF,genP,treeId,prevId,clr){
        var wrap=document.getElementById(treeId); wrap.innerHTML='';
        var tree=document.createElement('div'); tree.className='ftree';
        var proj=genP.length>0?genP[0].split('/')[0]:'output';
        var h=document.createElement('div'); h.className='fth';
        h.innerHTML='<span>📁 '+esc(proj)+'/</span><span style={{color:"var(--muted)",fontWeight:400}}>'+genP.length+' files</span>';
        tree.appendChild(h);
        var body=document.createElement('div'); body.className='ftb';
        var folders={};
        genP.forEach(function(p){
          var parts=p.split('/').slice(1);
          var folder=parts.length>1?parts.slice(0,-1).join('/'):'';
          if(!folders[folder]) folders[folder]=[];
          folders[folder].push({ rel:parts.join('/'), full:p });
        });
        Object.keys(folders).sort().forEach(function(folder){
          if(folder){ var fh=document.createElement('div'); fh.className='ftf'; fh.textContent='📂 '+folder+'/'; body.appendChild(fh); }
          folders[folder].sort(function(a,b){ return a.rel.localeCompare(b.rel); }).forEach(function(item){
            var node=document.createElement('div');
            node.className='ftn'+(folder?' fti':'');
            var ext=item.rel.split('.').pop();
            node.innerHTML='<span style={{fontSize:"11px",flexShrink:0}}>'+ficon(ext)+'</span>'
              +'<span className="ftn-name">'+esc(item.rel.split('/').pop())+'</span>'
              +'<span className="ftn-size">'+fmtSz((genF[item.full]||'').length)+'</span>';
            node.onclick=(function(path,n){ return function(){ showPrev(path,genF,prevId,clr,n); }; })(item.full,node);
            body.appendChild(node);
          });
        });
        tree.appendChild(body); wrap.appendChild(tree);
        var first=genP.find(function(p){ return p.endsWith('.tsx')||p.endsWith('.html'); })||genP[0];
        if(first){ var fn=body.querySelector('.ftn'); if(fn) showPrev(first,genF,prevId,clr,fn); }
      }
      
      function showPrev(path,genF,prevId,clr,node){
        if(node){
          var tb=node.closest('.ftb');
          if(tb) tb.querySelectorAll('.ftn').forEach(function(n){ n.classList.remove('act','act-p'); });
          node.classList.add(clr==='pu'?'act-p':'act');
        }
        var wrap=document.getElementById(prevId); wrap.innerHTML='';
        var pv=document.createElement('div'); pv.className='fprev';
        var rel=path.split('/').slice(1).join('/');
        var content=genF[path]||'';
        var h=document.createElement('div'); h.className='fp-hdr';
        h.innerHTML='<span className="fp-name'+(clr==='pu'?' pu':'')+'">'+esc(rel)+'</span>';
        var cb=document.createElement('button'); cb.className='fp-copy'; cb.textContent='Copy';
        cb.onclick=function(){ navigator.clipboard.writeText(content).then(function(){ cb.textContent='Copied!'; setTimeout(function(){ cb.textContent='Copy'; },1500); }); };
        h.appendChild(cb); pv.appendChild(h);
        var bd=document.createElement('div'); bd.className='fp-body'; bd.textContent=content;
        pv.appendChild(bd); wrap.appendChild(pv);
        pv.scrollIntoView({ behavior:'smooth', block:'nearest' });
      }
      
      // ═══ CDN EXTRACTION ═══
      function extractCdn(html){
        var links=[],scripts=[],pos=0;
        while(true){
          var s=html.toLowerCase().indexOf('',s); if(e===-1)break;
          var tag=html.slice(s,e+1),tl=tag.toLowerCase();
          if(tl.indexOf('stylesheet')!==-1||tl.indexOf('preconnect')!==-1){
            var hi=tl.indexOf('href=');
            if(hi!==-1){ var q=tag[hi+5],he=tag.indexOf(q,hi+6),href=tag.slice(hi+6,he);
              if(href.indexOf('http')===0||href.indexOf('//')===0){ var cl=tag.replace(/\s*\/?>$/, '').trim()+' />'; if(links.indexOf(cl)===-1)links.push(cl); }
            }
          }
          pos=e+1;
        }
        pos=0;
        while(true){
          var ss=html.toLowerCase().indexOf('<script',pos); if(ss===-1)break;
          var se=html.indexOf('>',ss); if(se===-1)break;
          var st=html.slice(ss,se+1),si=st.toLowerCase().indexOf('src=');
          if(si!==-1){ var sq=st[si+4],see=st.indexOf(sq,si+5),src=st.slice(si+5,see);
            if(src.indexOf('http')===0||src.indexOf('//')===0){ var fs=st+'<'+'/script>'; if(scripts.indexOf(fs)===-1)scripts.push(fs); }
          }
          pos=se+1;
        }
        return { links:links, scripts:scripts };
      }
      
      function extractCdnFromJsx(jsx){
        var links=[],scripts=[];
        var lr=/]*)>/gi,lm;
        while((lm=lr.exec(jsx))!==null){
          var tag=lm[0];
          if(/href=["'](https?:|\/\/)/.test(tag)){ var c=tag.replace(/className=/g,'class='); if(links.indexOf(c)===-1)links.push(c); }
        }
        var sr=/<script\b[^>]+src=["'](https?:|\/\/)[^"']+["'][^>]*>\s*<\/script>/gi,sm;
        while((sm=sr.exec(jsx))!==null){ if(scripts.indexOf(sm[0])===-1)scripts.push(sm[0]); }
        return { links:links, scripts:scripts };
      }
      
      // ═══════════════════════════════
      //  PANEL A: HTML → NEXT.JS
      // ═══════════════════════════════
      var aFiles=[], aGen={}, aGenP=[];
      mkDz('a-dz','a-fi',function(f){ readFiles(f,['html'],aFiles,'a-chips'); });
      
      function aClear(){
        aFiles=[]; aGen={}; aGenP=[];
        ['a-chips','a-tree','a-prev'].forEach(function(id){ document.getElementById(id).innerHTML=''; });
        document.getElementById('a-paste').value='';
        document.getElementById('a-rc').classList.remove('on');
        document.getElementById('a-pw').classList.remove('on');
        document.getElementById('a-dl').style.display='none';
        document.getElementById('a-cvt').disabled=false;
        document.getElementById('a-es').style.display='flex';
        document.getElementById('a-ot').textContent='Output';
        document.getElementById('a-om').textContent='';
      }
      
      async function aStart(){
        var pasted=document.getElementById('a-paste').value.trim();
        var proj=(document.getElementById('a-proj').value.trim()||'my-next-app').toLowerCase().replace(/[^a-z0-9-]/g,'-');
        document.getElementById('a-proj').value=proj;
        var pages=aFiles.map(function(f){ return {name:f.name,content:f.content}; });
        if(pasted.length>10) pages.push({ name:'index.html',content:pasted });
        if(!pages.length){ alert('Add at least one HTML file or paste HTML.'); return; }
      
        document.getElementById('a-es').style.display='none';
        document.getElementById('a-rc').classList.remove('on');
        document.getElementById('a-tree').innerHTML=''; document.getElementById('a-prev').innerHTML='';
        document.getElementById('a-dl').style.display='none';
        document.getElementById('a-cvt').disabled=true;
        document.getElementById('a-pw').classList.add('on');
        document.getElementById('a-pl').innerHTML='';
        setBar('a-pb',0); aGen={}; aGenP=[];
        document.getElementById('a-ot').textContent=proj;
        document.getElementById('a-om').textContent='Converting…';
      
        var pfx=proj+'/';
        function addF(p,c){ aGen[p]=c; aGenP.push(p); }
        function log(m,c){ lg('a-pl',m,c); }
      
        log('Creating project structure…');
        setBar('a-pb',5);
      
        addF(pfx+'package.json',JSON.stringify({name:proj,version:'0.1.0',private:true,scripts:{dev:'next dev',build:'next build',start:'next start'},dependencies:{next:'15.3.6',react:'^18','react-dom':'^18'},devDependencies:{'@types/node':'^22','@types/react':'^18','@types/react-dom':'^18',typescript:'^5'}},null,2));
        addF(pfx+'next.config.js',"/** @type {import('next').NextConfig} */\nconst nextConfig = { reactStrictMode: true }\nmodule.exports = nextConfig");
        addF(pfx+'tsconfig.json',JSON.stringify({compilerOptions:{lib:['dom','dom.iterable','esnext'],allowJs:true,skipLibCheck:true,strict:false,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'preserve',incremental:true,paths:{'@/*':['./*']}},include:['next-env.d.ts','**/*.ts','**/*.tsx'],exclude:['node_modules']},null,2));
        addF(pfx+'next-env.d.ts','/// <reference types="next" />\n/// <reference types="next/image-types/global" />');
        addF(pfx+'vercel.json',JSON.stringify({framework:'nextjs',buildCommand:'next build',headers:[{source:'/(.*)',headers:[{key:'Cross-Origin-Opener-Policy',value:'same-origin'},{key:'Cross-Origin-Embedder-Policy',value:'require-corp'}]}]},null,2));
        addF(pfx+'.gitignore','node_modules\n.next\ndist\n.env\n.env.local');
        addF(pfx+'README.md','# '+proj+'\n\nConverted from HTML.\n\n```bash\nnpm install\nnpm run dev\n```\n');
      
        var css='';
        pages.forEach(function(p){ var re=/<style[^>]*>([\s\S]*?)<\/style>/gi,sm; while((sm=re.exec(p.content))!==null) css+='/* from: '+p.name+' */\n'+sm[1].trim()+'\n\n'; });
        addF(pfx+'app/globals.css',css||'/* styles */');
      
        var allL=[],allS=[];
        pages.forEach(function(p){ var r=extractCdn(p.content); r.links.forEach(function(l){ if(allL.indexOf(l)===-1)allL.push(l); }); r.scripts.forEach(function(s){ if(allS.indexOf(s)===-1)allS.push(s); }); });
        addF(pfx+'app/layout.tsx',"import './globals.css'\nexport const metadata = { title: '"+proj+"', description: 'Converted' }\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    \n      "+(allL.length?'\n        '+allL.join('\n        '):'')+"\n      {children}"+(allS.length?'\n        '+allS.join('\n        '):'')+"\n
    </>
  )
}