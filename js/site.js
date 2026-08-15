(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* reading progress bar */
  var bar = document.querySelector('.progress');
  function updateProgress(){
    if(!bar) return;
    var h = document.documentElement;
    var scrollable = h.scrollHeight - h.clientHeight;
    var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if(reduceMotion || !('IntersectionObserver' in window)){
    revealEls.forEach(function(el){ el.classList.add('in-view'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* TOC active section tracking */
  var tocLinks = document.querySelectorAll('.toc a');
  var sections = document.querySelectorAll('.section[id]');
  if(tocLinks.length && sections.length && 'IntersectionObserver' in window){
    var byId = {};
    tocLinks.forEach(function(a){ byId[a.getAttribute('href').replace('#','')] = a; });
    var secObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        var link = byId[entry.target.id];
        if(!link) return;
        if(entry.isIntersecting){
          tocLinks.forEach(function(a){ a.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
    sections.forEach(function(s){ secObserver.observe(s); });
  }

  /* chip -> detail jump highlight */
  document.querySelectorAll('.chip[href^="#"]').forEach(function(chip){
    chip.addEventListener('click', function(){
      var id = chip.getAttribute('href').slice(1);
      var target = document.getElementById(id);
      if(!target) return;
      target.classList.remove('flash');
      void target.offsetWidth;
      target.classList.add('flash');
      setTimeout(function(){ target.classList.remove('flash'); }, 1500);
    });
  });

  /* scroll to top */
  var topLink = document.querySelector('.top-link');
  if(topLink){
    document.addEventListener('scroll', function(){
      if(window.scrollY > 600){ topLink.classList.add('show'); }
      else { topLink.classList.remove('show'); }
    }, { passive: true });
  }
})();
