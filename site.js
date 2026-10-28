/* Dave & Marbie's Cafe: side menu on mobile + the menu embed on the Menu page. */
(function(){
  /* ---------- Side menu ---------- */
  var btn=document.getElementById('menuBtn'), drawer=document.getElementById('drawer'),
      scrim=document.getElementById('scrim'), closeBtn=document.getElementById('closeBtn');
  if(btn && drawer){
    function openDrawer(){
      drawer.hidden=false; scrim.hidden=false;
      requestAnimationFrame(function(){ drawer.classList.add('open'); scrim.classList.add('show'); });
      btn.setAttribute('aria-expanded','true'); document.body.classList.add('drawer-open');
      closeBtn.focus();
    }
    function closeDrawer(){
      drawer.classList.remove('open'); scrim.classList.remove('show');
      btn.setAttribute('aria-expanded','false'); document.body.classList.remove('drawer-open');
      setTimeout(function(){ if(!drawer.classList.contains('open')){ drawer.hidden=true; scrim.hidden=true; } },300);
      btn.focus();
    }
    btn.addEventListener('click',openDrawer);
    closeBtn.addEventListener('click',closeDrawer);
    scrim.addEventListener('click',closeDrawer);
    document.addEventListener('keydown',function(e){ if(e.key==='Escape' && drawer.classList.contains('open')) closeDrawer(); });
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click',function(){ if(drawer.classList.contains('open')) closeDrawer(); }); });
    window.addEventListener('resize',function(){ if(window.innerWidth>820 && drawer.classList.contains('open')) closeDrawer(); });
  }

  /* ---------- Menu embed ----------
     Loads the live menu from the FruitPop repo, so menu edits there show up here.
     If it can't load, a built-in copy of the menu is shown instead. */
  var host=document.getElementById('menuEmbed');
  if(!host) return;
  var LIVE_MENU='https://amberjean755.github.io/FruitPop/dave-and-marbies-menu.html';
  var root=host.attachShadow({mode:'open'});
  var tpl=document.getElementById('menuTpl');
  if(tpl) root.appendChild(tpl.content.cloneNode(true));
  try{
    fetch(LIVE_MENU,{cache:'no-cache'}).then(function(r){ if(!r.ok) throw 0; return r.text(); }).then(function(html){
      var doc=new DOMParser().parseFromString(html,'text/html');
      if(!doc.body || !doc.body.children.length) return;
      var css=Array.prototype.map.call(doc.querySelectorAll('style'),function(s){return s.textContent;}).join('\n');
      css=css.replace(/:root\s*\{/g,':host{').replace(/(^|[\s}])body\s*\{/g,'$1.menu-root{');
      root.innerHTML='<style>'+css+'\n.hero{display:none!important}.page{padding-top:8px}</style><div class="menu-root">'+doc.body.innerHTML+'</div>';
    }).catch(function(){});
  }catch(e){}
})();
