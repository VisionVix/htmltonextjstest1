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
    d.innerHTML='<span class="chip-ico">'+ficon(f.name.split('.').pop())+'</span>'
      +'<span class="chip-name" title="'+esc(f.name)+'">'+esc(displayName)+'</span>'
      +'<span class="chip-size">'+fmtSz(f.content.length)+'</span>'
      +'<button class="chip-del">✕</button>';
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
  h.innerHTML='<span>📁 '+esc(proj)+'/</span><span style="color:var(--muted);font-weight:400">'+genP.length+' files</span>';
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
      node.innerHTML='<span style="font-size:11px;flex-shrink:0">'+ficon(ext)+'</span>'
        +'<span class="ftn-name">'+esc(item.rel.split('/').pop())+'</span>'
        +'<span class="ftn-size">'+fmtSz((genF[item.full]||'').length)+'</span>';
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
  h.innerHTML='<span class="fp-name'+(clr==='pu'?' pu':'')+'">'+esc(rel)+'</span>';
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
    var s=html.toLowerCase().indexOf('<link',pos); if(s===-1)break;
    var e=html.indexOf('>',s); if(e===-1)break;
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
  var lr=/<link\b([^>]*)>/gi,lm;
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
  addF(pfx+'app/layout.tsx',"import './globals.css'\nexport const metadata = { title: '"+proj+"', description: 'Converted' }\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <head>"+(allL.length?'\n        '+allL.join('\n        '):'')+"</head>\n      <body>{children}"+(allS.length?'\n        '+allS.join('\n        '):'')+"\n      </body>\n    </html>\n  )\n}");

  log('✓ Base structure ready','ok'); setBar('a-pb',20);

  var combinedJs='';
  for(var i=0;i<pages.length;i++){
    var page=pages[i];
    // If file came from zip, route from its path; otherwise from filename
    var routeBase=page.name.replace(/\.html$/,'');
    // strip leading project folder if present (e.g. mysite/about -> about)
    var routeParts=routeBase.split('/').filter(Boolean);
    if(routeParts.length>1) routeParts=routeParts.slice(1); // drop project prefix
    var routeStr=routeParts.join('/').replace(/\/index$/,'').replace(/^index$/,'');
    var route=routeStr?'/'+routeStr:'/';
    var isHome=route==='/';
    var npath=isHome?'app/page.tsx':'app'+route+'/page.tsx';
    log('Converting <code>'+esc(page.name)+'</code> → <code>'+npath+'</code>…');
    setBar('a-pb',20+Math.round(i/pages.length*72)); await sleep(20);
    try {
      var res=aConvert(page.content,route,proj);
      addF(pfx+npath,res.tsx);
      if(res.js&&res.js.trim()) combinedJs+='\n/* from: '+page.name+' */\n'+res.js.trim()+'\n';
      log('✓ '+npath,'ok');
    } catch(e){ log('✗ '+page.name+': '+e.message,'er'); addF(pfx+npath,aFallback(page.content)); }
    setBar('a-pb',20+Math.round((i+1)/pages.length*72));
  }
  if(combinedJs.trim()) addF(pfx+'public/page-scripts.js',combinedJs.trim());
  setBar('a-pb',98); log('Finalising…'); await sleep(60); setBar('a-pb',100);
  log('✓ Done! '+pages.length+' page'+(pages.length===1?'':'s')+' converted.','ok'); await sleep(80);

  document.getElementById('a-pw').classList.remove('on');
  document.getElementById('a-cvt').disabled=false;
  var rc=document.getElementById('a-rc');
  rc.innerHTML='✓ <strong>'+proj+'</strong> — <strong>'+aGenP.length+' files</strong>.<br>Download ZIP → <code>npm install</code> → <code>npm run dev</code>';
  rc.classList.add('on');
  document.getElementById('a-om').textContent=aGenP.length+' files';
  document.getElementById('a-dl').style.display='flex';
  renderTree(aGen,aGenP,'a-tree','a-prev','bl');
}

async function aDL(){
  var btn=document.getElementById('a-dl'); btn.textContent='Zipping…'; btn.disabled=true;
  var zip=new JSZip();
  aGenP.forEach(function(p){ zip.file(p,aGen[p]||''); });
  var blob=await zip.generateAsync({type:'blob'});
  var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url;
  a.download=(aGenP[0]||'project').split('/')[0]+'.zip'; a.click(); URL.revokeObjectURL(url);
  btn.textContent='↓ Download ZIP'; btn.disabled=false;
}

function aConvert(html,route,sn){
  var css=''; var re=/<style[^>]*>([\s\S]*?)<\/style>/gi,sm;
  while((sm=re.exec(html))!==null) css+=sm[1].trim()+'\n\n';
  var js=''; var sr=/<script([^>]*)>([\s\S]*?)<\/script>/gi,sc;
  while((sc=sr.exec(html))!==null){ if(sc[1].indexOf('src=')===-1&&sc[2].trim()) js+=sc[2].trim()+'\n\n'; }
  var tm=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  var dm=html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  var pt=tm?tm[1].trim():sn, pd=dm?dm[1].trim():'Converted';
  var bm=html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  var body=bm?bm[1]:html;
  body=body.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<link[^>]+>/gi,'');
  body=body.replace(/<!--([\s\S]*?)-->/g,'{/*$1*/}');
  body=body.replace(/\sclass=/g,' className=').replace(/\sfor=/g,' htmlFor=').replace(/\stabindex=/g,' tabIndex=')
    .replace(/\scolspan=/g,' colSpan=').replace(/\srowspan=/g,' rowSpan=').replace(/\snovalidate/g,' noValidate')
    .replace(/\sreadonly/g,' readOnly').replace(/\smaxlength=/g,' maxLength=').replace(/\sautocomplete=/g,' autoComplete=')
    .replace(/\sautofocus/g,' autoFocus').replace(/\senctype=/g,' encType=').replace(/\scrossorigin=/g,' crossOrigin=');
  body=body.replace(/\sstroke-width=/g,' strokeWidth=').replace(/\sstroke-linecap=/g,' strokeLinecap=')
    .replace(/\sfill-rule=/g,' fillRule=').replace(/\sclip-rule=/g,' clipRule=').replace(/\sview-box=/g,' viewBox=')
    .replace(/\sfont-size=/g,' fontSize=').replace(/\sfont-family=/g,' fontFamily=').replace(/\sfont-weight=/g,' fontWeight=');
  body=body.replace(/\sonclick="([^"]*)"/g,function(m,c){ return ' onClick={() => { '+c.replace(/"/g,"'")+" }}"; });
  body=body.replace(/\sonchange="([^"]*)"/g,function(m,c){ return ' onChange={(e) => { '+c.replace(/"/g,"'")+" }}"; });
  body=body.replace(/\sonsubmit="([^"]*)"/g,function(m,c){ return ' onSubmit={(e) => { e.preventDefault(); '+c.replace(/"/g,"'")+" }}"; });
  body=body.replace(/\sonkeyup="([^"]*)"/g,function(m,c){ return ' onKeyUp={(e) => { '+c.replace(/"/g,"'")+" }}"; });
  body=body.replace(/\sonblur="([^"]*)"/g,function(m,c){ return ' onBlur={(e) => { '+c.replace(/"/g,"'")+" }}"; });
  var voids='area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr|canvas';
  body=body.replace(/=>/g,'__ARW__').replace(new RegExp('<('+voids+')([^>]*?)(?<!/)>','gi'),'<$1$2 />').replace(/__ARW__/g,'=>');
  body=body.replace(new RegExp('<\/('+voids+')>','gi'),'');
  body=body.replace(/\sstyle="([^"]*)"/g,function(m,c){
    var obj=c.replace(/\s*([a-z-]+)\s*:\s*([^;]+);?\s*/g,function(_,p,v){
      var cam=p.replace(/-([a-z])/g,function(_,l){ return l.toUpperCase(); });
      v=v.trim(); var nums=["opacity","zIndex","flexGrow","flexShrink","fontWeight"];
      return cam+':'+(nums.indexOf(cam)>=0&&!isNaN(v)?v:'"'+v.replace(/"/g,"'")+'"')+',';
    }).replace(/,$/,'');
    return ' style={{'+obj+'}}';
  });
  body=body.replace(/<\/?(html|head|body)[^>]*>/gi,'').trim();
  var cn=(route==='/'||!route)?'HomePage':route.split('/').filter(Boolean).map(function(s){ return s[0].toUpperCase()+s.slice(1); }).join('')+'Page';
  var tsx='// @ts-nocheck\n/* eslint-disable */\n"use client"\n\nimport Image from "next/image"\nimport Link from "next/link"\n\n'
    +'export const metadata = { title: "'+pt.replace(/"/g,'\\"')+'", description: "'+pd.replace(/"/g,'\\"')+'" }\n\n'
    +'export default function '+cn+'() {\n  return (\n    <>\n'
    +body.split('\n').map(function(l){ return '      '+l; }).join('\n')
    +'\n    </>\n  )\n}';
  return { tsx:tsx, css:css, js:js };
}
function aFallback(html){
  var m=html.match(/<body[^>]*>([\s\S]*?)<\/body>/i), c=m?m[1]:html;
  c=c.replace(/\sclass=/g,' className=');
  return '// @ts-nocheck\nexport default function Page() {\n  return <div dangerouslySetInnerHTML={{ __html: `'+c.replace(/`/g,'\\`')+'` }} />\n}';
}

// ═══════════════════════════════
//  PANEL B: NEXT.JS → HTML
// ═══════════════════════════════
var bFiles=[], bGen={}, bGenP=[];
mkDz('b-dz','b-fi',function(f){ readFiles(f,['tsx','ts','jsx','js','css'],bFiles,'b-chips'); });

function bClear(){
  bFiles=[]; bGen={}; bGenP=[];
  ['b-chips','b-tree','b-prev'].forEach(function(id){ document.getElementById(id).innerHTML=''; });
  document.getElementById('b-paste').value='';
  document.getElementById('b-css').value='';
  document.getElementById('b-rc').classList.remove('on');
  document.getElementById('b-pw').classList.remove('on');
  document.getElementById('b-dl').style.display='none';
  document.getElementById('b-cvt').disabled=false;
  document.getElementById('b-es').style.display='flex';
  document.getElementById('b-ot').textContent='Output';
  document.getElementById('b-om').textContent='';
}

async function bStart(){
  var pasted=document.getElementById('b-paste').value.trim();
  var pastedCss=document.getElementById('b-css').value.trim();
  var outName=(document.getElementById('b-out').value.trim()||'index').replace(/\.html$/,'');
  var sources=bFiles.map(function(f){ return {name:f.name,content:f.content}; });
  if(pasted.length>10) sources.unshift({ name:'page.tsx',content:pasted });
  if(!sources.length){ alert('Add at least one .tsx/.jsx file or paste TSX.'); return; }

  document.getElementById('b-es').style.display='none';
  document.getElementById('b-rc').classList.remove('on');
  document.getElementById('b-tree').innerHTML=''; document.getElementById('b-prev').innerHTML='';
  document.getElementById('b-dl').style.display='none';
  document.getElementById('b-cvt').disabled=true;
  document.getElementById('b-pw').classList.add('on');
  document.getElementById('b-pl').innerHTML='';
  setBar('b-pb',0); bGen={}; bGenP=[];
  document.getElementById('b-ot').textContent=outName+'.html';
  document.getElementById('b-om').textContent='Converting…';

  var pfx='output/';
  function addF(p,c){ bGen[p]=c; bGenP.push(p); }
  function log(m,c){ lg('b-pl',m,c); }

  log('Parsing Next.js files…'); setBar('b-pb',10); await sleep(20);

  var layoutFile=sources.find(function(f){ return f.name==='layout.tsx'||f.name==='layout.jsx'; });
  var pageFiles=sources.filter(function(f){ return f.name==='page.tsx'||f.name==='page.jsx'||f.name.endsWith('Page.tsx'); });
  var cssFiles=sources.filter(function(f){ return f.name.endsWith('.css'); });

  var globalCss=pastedCss;
  cssFiles.forEach(function(f){ globalCss+='\n\n/* from: '+f.name+' */\n'+f.content; });
  globalCss=globalCss.trim();

  var cdnLinks=[],cdnScripts=[];
  if(layoutFile){
    var cdnR=extractCdnFromJsx(layoutFile.content);
    cdnLinks=cdnR.links; cdnScripts=cdnR.scripts;
    log('✓ Layout detected — CDN links extracted','ok');
  }

  var allSrc=sources.map(function(f){ return f.content; }).join('\n');
  var ttl='Converted App', dsc='';
  var tm=allSrc.match(/title:\s*["'`]([^"'`]+)["'`]/); if(tm) ttl=tm[1];
  var dm=allSrc.match(/description:\s*["'`]([^"'`]+)["'`]/); if(dm) dsc=dm[1];

  setBar('b-pb',30);

  var toConvert=pageFiles.length>0?pageFiles:sources.filter(function(f){ return f.name.endsWith('.tsx')||f.name.endsWith('.jsx'); });
  if(!toConvert.length&&sources.length) toConvert=[sources[0]];

  log('Converting '+toConvert.length+' page'+(toConvert.length===1?'':'s')+'…'); await sleep(20);

  for(var i=0;i<toConvert.length;i++){
    var src=toConvert[i];
    var fname=toConvert.length===1?outName:(outName+'-'+i);
    var hname=fname+'.html';
    log('Converting <code>'+esc(src.name)+'</code> → <code>'+esc(hname)+'</code>…');
    setBar('b-pb',30+Math.round(i/toConvert.length*60)); await sleep(20);
    try {
      addF(pfx+hname, bConvert(src.content,ttl,dsc,globalCss,cdnLinks,cdnScripts));
      log('✓ '+hname,'ok');
    } catch(e){
      log('✗ '+src.name+': '+e.message,'er');
      addF(pfx+hname,bFallback(src.content,ttl,globalCss));
    }
    setBar('b-pb',30+Math.round((i+1)/toConvert.length*60));
  }

  setBar('b-pb',98); log('Finalising…'); await sleep(60); setBar('b-pb',100);
  log('✓ Done!','ok'); await sleep(80);

  document.getElementById('b-pw').classList.remove('on');
  document.getElementById('b-cvt').disabled=false;
  var rc=document.getElementById('b-rc');
  rc.innerHTML='✓ <strong>'+bGenP.length+' HTML file'+(bGenP.length===1?'':'s')+'</strong> generated. Each file is fully self-contained — open directly in any browser.';
  rc.classList.add('on');
  document.getElementById('b-om').textContent=bGenP.length+' files';
  document.getElementById('b-dl').style.display='flex';
  renderTree(bGen,bGenP,'b-tree','b-prev','pu');
}

async function bDL(){
  if(bGenP.length===1){
    var blob=new Blob([bGen[bGenP[0]]],{type:'text/html'});
    var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url;
    a.download=bGenP[0].split('/').pop(); a.click(); URL.revokeObjectURL(url);
  } else {
    var btn=document.getElementById('b-dl'); btn.textContent='Zipping…'; btn.disabled=true;
    var zip=new JSZip();
    bGenP.forEach(function(p){ zip.file(p,bGen[p]||''); });
    var blob=await zip.generateAsync({type:'blob'});
    var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url;
    a.download='converted-html.zip'; a.click(); URL.revokeObjectURL(url);
    btn.textContent='↓ Download HTML'; btn.disabled=false;
  }
}

function bConvert(tsx,ttl,dsc,globalCss,cdnLinks,cdnScripts){
  // Extract return body
  var body=tsx;
  var rm=tsx.match(/return\s*\(\s*([\s\S]*?)\s*\)\s*\}?\s*$/);
  if(rm) body=rm[1].trim();
  if(body.startsWith('<>')) body=body.slice(2);
  if(body.endsWith('</>')) body=body.slice(0,-3);

  // JSX attrs → HTML
  body=body.replace(/\bclassName=/g,'class=').replace(/\bhtmlFor=/g,'for=')
    .replace(/\btabIndex=/g,'tabindex=').replace(/\bcolSpan=/g,'colspan=')
    .replace(/\browSpan=/g,'rowspan=').replace(/\bnoValidate\b/g,'novalidate')
    .replace(/\breadOnly\b/g,'readonly').replace(/\bmaxLength=/g,'maxlength=')
    .replace(/\bautoComplete=/g,'autocomplete=').replace(/\bautoFocus\b/g,'autofocus')
    .replace(/\bencType=/g,'enctype=').replace(/\bcrossOrigin=/g,'crossorigin=');

  // SVG kebab
  body=body.replace(/\bstrokeWidth=/g,'stroke-width=').replace(/\bstrokeLinecap=/g,'stroke-linecap=')
    .replace(/\bstrokeLinejoin=/g,'stroke-linejoin=').replace(/\bfillRule=/g,'fill-rule=')
    .replace(/\bclipRule=/g,'clip-rule=').replace(/\bviewBox=/g,'viewbox=')
    .replace(/\btextAnchor=/g,'text-anchor=').replace(/\bdominantBaseline=/g,'dominant-baseline=');

  // Event handlers
  body=body.replace(/\bonClick=\{\(\)\s*=>\s*\{([^}]*)\}\}/g,function(m,c){ return 'onclick="'+c.replace(/"/g,"'").trim()+'"'; });
  body=body.replace(/\bonClick=\{[^}]*?=>\s*([^}]+)\}/g,function(m,c){ return 'onclick="'+c.replace(/"/g,"'").trim()+'"'; });
  body=body.replace(/\bonChange=\{[^}]*?=>\s*([^}]+)\}/g,function(m,c){ return 'onchange="'+c.replace(/"/g,"'").trim()+'"'; });
  body=body.replace(/\bonSubmit=\{[^}]*?=>\s*([^}]+)\}/g,function(m,c){ return 'onsubmit="'+c.replace(/"/g,"'").trim()+'"'; });
  body=body.replace(/\bonKeyDown=\{[^}]*?=>\s*([^}]+)\}/g,function(m,c){ return 'onkeydown="'+c.replace(/"/g,"'").trim()+'"'; });
  body=body.replace(/\bonBlur=\{[^}]*?=>\s*([^}]+)\}/g,function(m,c){ return 'onblur="'+c.replace(/"/g,"'").trim()+'"'; });
  body=body.replace(/\bonFocus=\{[^}]*?=>\s*([^}]+)\}/g,function(m,c){ return 'onfocus="'+c.replace(/"/g,"'").trim()+'"'; });

  // style={{...}} → style="..."
  body=body.replace(/\bstyle=\{\{([\s\S]*?)\}\}/g,function(m,inner){
    var css=inner.replace(/\s+/g,' ').trim().split(',').map(function(pair){
      var kv=pair.trim().split(':'); if(kv.length<2) return '';
      var prop=kv[0].trim().replace(/([A-Z])/g,function(_,c){ return '-'+c.toLowerCase(); });
      var val=kv.slice(1).join(':').trim().replace(/^["']|["']$/g,'');
      return prop+': '+val;
    }).filter(Boolean).join('; ');
    return 'style="'+css+'"';
  });

  // JSX comments → HTML
  body=body.replace(/\{\/\*([\s\S]*?)\*\/\}/g,'<!--$1-->');

  // Template literals & string exprs
  body=body.replace(/\{`([^`]*)`\}/g,'$1');
  body=body.replace(/\{"([^"]*)"\}/g,'$1');
  body=body.replace(/\{'([^']*)'\}/g,'$1');

  // Next.js components → HTML
  body=body.replace(/<Image\s/g,'<img ').replace(/<\/Image>/g,'');
  body=body.replace(/<Link\s+href="([^"]*)"/g,'<a href="$1"').replace(/<\/Link>/g,'</a>');

  // JSX self-closed → proper HTML
  body=body.replace(/<(div|section|article|main|header|footer|nav|aside|span|p|h[1-6]|ul|ol|li|form|label|button|select|textarea|a)([^>]*?)\/>/gi,
    function(m,tag,attrs){ return '<'+tag+attrs+'></'+tag+'>'; });

  // Remove remaining JSX expressions
  body=body.replace(/\{[^{}<>]*\}/g,'');
  body=body.trim();

  var headCdn=cdnLinks.map(function(l){ return '  '+l.replace(' />','>'); }).join('\n');
  var bodyCdn=cdnScripts.map(function(s){ return '  '+s; }).join('\n');

  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
    +'  <meta charset="UTF-8" />\n'
    +'  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n'
    +'  <title>'+esc(ttl)+'</title>\n'
    +(dsc?'  <meta name="description" content="'+esc(dsc)+'" />\n':'')
    +(headCdn?headCdn+'\n':'')
    +(globalCss?'  <style>\n'+globalCss+'\n  </style>\n':'')
    +'</head>\n<body>\n'+body+'\n'
    +(bodyCdn?bodyCdn+'\n':'')
    +'</body>\n</html>';
}

function bFallback(tsx,ttl,css){
  var b=tsx.replace(/\bclassName=/g,'class=').replace(/^import.*/gm,'').replace(/^export.*/gm,'');
  return '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8" />\n  <title>'+esc(ttl)+'</title>\n'
    +(css?'  <style>\n'+css+'\n  </style>\n':'')+'</head>\n<body>\n'+b.trim()+'\n</body>\n</html>';
}

