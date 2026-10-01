(() => {
 'use strict';
 const translations=window.translations||{};
 let lang='en';try{lang=localStorage.getItem('mahakaaleshwar-language')||'en'}catch{}
 if(!['en','hi','mr'].includes(lang))lang='en';
 const tr=k=>translations[k]?.[lang]||translations[k]?.en||k;
 const booking=document.getElementById('booking-form');
 const indiaNow=()=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());const o=Object.fromEntries(p.map(x=>[x.type,x.value]));return {date:`${o.year}-${o.month}-${o.day}`,time:`${o.hour}:${o.minute}`}};
 const applyLanguage=value=>{lang=value;document.documentElement.lang=value;document.querySelectorAll('[data-i18n]').forEach(el=>{if(translations[el.dataset.i18n])el.textContent=tr(el.dataset.i18n)});document.querySelectorAll('.language-select').forEach(el=>el.value=value);try{localStorage.setItem('mahakaaleshwar-language',value)}catch{}document.querySelectorAll('[data-custom-error]').forEach(el=>el.setCustomValidity(tr(el.dataset.customError)));if(booking&&!document.getElementById('booking-review').hidden)renderReview();document.querySelectorAll('form[data-reviewed=true]').forEach(form=>renderEnquiry(form));};
 document.querySelectorAll('.language-select').forEach(el=>el.addEventListener('change',()=>applyLanguage(el.value)));
 const toggle=document.querySelector('.menu-button'),nav=document.querySelector('#main-navigation');
 toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'×':'☰'});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';toggle.focus()}});
 const path=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('#main-navigation a').forEach(a=>{if(a.getAttribute('href')===path)a.setAttribute('aria-current','page')});
 const getBookingRows=()=>{const d=new FormData(booking);const service=document.getElementById('service');return [[tr('fullName'),d.get('fullName')],[tr('phone'),d.get('phone')],[tr('email'),d.get('email')||tr('notProvided')],[tr('serviceField'),service.selectedOptions[0]?.textContent],[tr('mode'),tr(d.get('mode'))],[tr('date'),d.get('date')],[tr('time'),d.get('time')+' IST'],[tr('birthDate'),d.get('birthDate')||tr('notProvided')],[tr('birthTime'),d.get('birthTime')||tr('notProvided')],[tr('birthPlace'),d.get('birthPlace')||tr('notProvided')],[tr('question'),d.get('question')]]};
 function renderReview(){const rows=getBookingRows(),dl=document.getElementById('review-details');dl.replaceChildren();rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;dl.append(dt,dd)});const message=tr('appointmentRequest')+'\n\n'+rows.map(([k,v])=>k+': '+v).join('\n');document.getElementById('send-booking').href='https://wa.me/919371155659?text='+encodeURIComponent(message)}
 if(booking){
  const date=document.getElementById('date'),time=document.getElementById('time'),birth=document.getElementById('birthDate'),service=document.getElementById('service');
  const clearError=e=>{e.setCustomValidity('');delete e.dataset.customError};
  const setError=(e,k)=>{e.dataset.customError=k;e.setCustomValidity(tr(k))};
  const updateTimes=()=>{const now=indiaNow();date.min=now.date;birth.max=now.date;for(const option of time.options){option.disabled=!!option.value&&date.value===now.date&&option.value<=now.time}if(time.selectedOptions[0]?.disabled)time.value=''};
  const requirements=()=>{const needs=['0','2','6'].includes(service.value);document.getElementById('birthDate').required=needs;document.getElementById('birthPlace').required=needs;['birthDate','birthPlace'].forEach(id=>{const label=document.querySelector(`label[for="${id}"]`);let mark=label.querySelector('.required-star');if(needs&&!mark){mark=document.createElement('span');mark.className='required-star';mark.textContent=' *';mark.setAttribute('aria-hidden','true');label.append(mark)}else if(!needs&&mark)mark.remove()})};
  booking.querySelectorAll('input,select,textarea').forEach(el=>el.addEventListener('input',()=>clearError(el)));
  date.addEventListener('change',updateTimes);service.addEventListener('change',requirements);updateTimes();
  const requested=new URLSearchParams(location.search).get('service');if(requested!==null&&Array.from(service.options).some(o=>o.value===requested))service.value=requested;requirements();
  booking.addEventListener('submit',e=>{e.preventDefault();updateTimes();const now=indiaNow();if(date.value<now.date)setError(date,'futureDate');if(date.value===now.date&&time.value&&time.value<=now.time)setError(time,'futureTime');if(birth.value&&birth.value>now.date)setError(birth,'birthPast');if(!booking.reportValidity())return;renderReview();document.getElementById('booking-fields').hidden=true;const review=document.getElementById('booking-review');review.hidden=false;document.getElementById('progress-details').classList.remove('active');document.getElementById('progress-review').classList.add('active');review.focus();review.scrollIntoView({behavior:'smooth',block:'start'})});
  document.getElementById('edit-booking').addEventListener('click',()=>{document.getElementById('booking-fields').hidden=false;document.getElementById('booking-review').hidden=true;document.getElementById('progress-details').classList.add('active');document.getElementById('progress-review').classList.remove('active');document.getElementById('fullName').focus()});
 }
 function renderEnquiry(form){const lines=[];form.querySelectorAll('input,select,textarea').forEach(field=>{if(field.value)lines.push((field.labels?.[0]?.textContent.trim()||field.name)+': '+field.value)});const notice=form.querySelector('.form-notice');notice.hidden=false;notice.replaceChildren();const p=document.createElement('p');p.textContent=tr('requestReady');const a=document.createElement('a');a.className='royal-button';a.textContent=tr('sendWhatsApp');a.href='https://wa.me/919371155659?text='+encodeURIComponent(tr('contactRequest')+'\n\n'+lines.join('\n'));a.target='_blank';a.rel='noopener noreferrer';notice.append(p,a)}
 const contact=document.getElementById('contact-form');contact?.addEventListener('submit',e=>{e.preventDefault();if(!contact.reportValidity())return;contact.dataset.reviewed='true';renderEnquiry(contact)});contact?.addEventListener('input',()=>{delete contact.dataset.reviewed;contact.querySelector('.form-notice').hidden=true});
 const tabs=Array.from(document.querySelectorAll('[data-period]'));const setPeriod=tab=>{tabs.forEach(b=>{b.setAttribute('aria-selected',String(b===tab));b.tabIndex=b===tab?0:-1});document.getElementById('zodiac-panel').setAttribute('aria-labelledby',tab.id);document.querySelectorAll('.period-reflection').forEach(p=>{p.dataset.i18n='period'+tab.dataset.period[0].toUpperCase()+tab.dataset.period.slice(1);p.textContent=tr(p.dataset.i18n)})};tabs.forEach((tab,i)=>{tab.tabIndex=i===0?0:-1;tab.addEventListener('click',()=>setPeriod(tab));tab.addEventListener('keydown',e=>{let index;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();setPeriod(tabs[index]);tabs[index].focus()})});
 applyLanguage(lang);
 // Keep anchors and focused fields clear of the sticky navigation.
 const stickyHeader=document.querySelector('.royal-header');
 const measureHeader=()=>document.documentElement.style.setProperty('--header-offset',`${(stickyHeader?.offsetHeight||90)+20}px`);
 measureHeader();if('ResizeObserver' in window)new ResizeObserver(measureHeader).observe(stickyHeader);
 // Reveal all content groups, including initially visible groups and form controls.
 const motionQuery=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!motionQuery.matches&&'IntersectionObserver' in window){
  const selector='.about-copy,.acharya,.about-benefits>div,.center-heading,.royal-service,.why-grid article,.process-art,.process-step,.review-grid blockquote,.royal-cta,.detail-card,.inner-portrait,.faq,.reading-intro,.center-action,.booking-aside,.contact-card,.paper-card>h2,.booking-progress,.field,.consent,form>button,.period-tabs,.inner-section>h2,.inner-section>p,.split>div,.policy-content>section,.footer-grid>div,.footer-bottom';
  const targets=Array.from(document.querySelectorAll(selector)).filter(el=>!el.parentElement.closest(selector));
  const reveal=el=>{el.classList.remove('view-pending');el.classList.add('view-shown')};
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(({target,isIntersecting})=>{if(isIntersecting){reveal(target);observer.unobserve(target)}});
  },{threshold:0,rootMargin:'0px 0px -16px 0px'});
  targets.forEach(el=>{
   const group=el.parentElement;
   const stagger=group.matches('.service-grid,.why-grid,.review-grid,.detail-grid,.about-benefits,.footer-grid,.field-grid');
   const index=Array.from(group.children).indexOf(el);
   el.style.setProperty('--view-delay',stagger?`${(index%3)*75}ms`:'0ms');
   el.classList.add('view-pending');
   el.addEventListener('focusin',()=>{reveal(el);observer.unobserve(el)},{once:true});
  });
  // Commit the starting frame before revealing initial viewport content.
  requestAnimationFrame(()=>requestAnimationFrame(()=>targets.forEach(el=>observer.observe(el))));
  motionQuery.addEventListener('change',event=>{
   if(event.matches){observer.disconnect();targets.forEach(reveal)}
  });
 }
 // Count up once when the statistics enter view; keep final values accessible.
 const counters=Array.from(document.querySelectorAll('.royal-stats strong')).map(el=>{
  const finalText=el.textContent.trim();
  return {el,finalText,target:Number(finalText.replace(/[^0-9]/g,'')),suffix:finalText.replace(/[0-9,]/g,'')};
 });
 if(counters.length&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  counters.forEach(({el,finalText,suffix})=>{
   el.setAttribute('aria-label',finalText);
   el.textContent='';
   const visual=document.createElement('span');
   visual.setAttribute('aria-hidden','true');
   visual.className='counter-value';
   visual.textContent='0'+suffix;
   el.append(visual);
  });
  const duration=1800;
  let started;
  const tick=now=>{
   started??=now;
   const progress=Math.min((now-started)/duration,1);
   const eased=1-Math.pow(1-progress,3);
   counters.forEach(({el,target,suffix,finalText})=>{
    el.firstElementChild.textContent=progress===1?finalText:Math.floor(target*eased)+suffix;
   });
   if(progress<1)requestAnimationFrame(tick);
  };
  const section=document.querySelector('.royal-stats');
  if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=0.4)){
     observer.disconnect();
     requestAnimationFrame(tick);
    }
   },{threshold:0.4});
   observer.observe(section);
  }else{
   // Older browsers show the final values rather than waiting indefinitely.
   counters.forEach(({el,finalText})=>{el.firstElementChild.textContent=finalText});
  }
 }
})();
