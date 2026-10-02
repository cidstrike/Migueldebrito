const films=[
['Film 01','Zvp_voO0co4'],['Film 02','Cc8BiWESzYM'],['Film 03','0xQpArffzjA'],['Film 04','uQ2b_QZcBaM'],['Film 05','Cr3tRdWQ4jM'],['Film 06','KUIVeWcThd0'],['Film 07','HWQRQMMFrQM'],['Film 08','gDceknakkjk'],['Film 09','Lg__RkGS0RQ'],['Film 10','pb9XTAmC4ek']];
const clips=[
['Clip 01','Cc8BiWESzYM'],['Clip 02','nvejEOub-G0'],['Clip 03','tXAfPpNL1XE'],['Clip 04','xbyMNIvPzck'],['Clip 05','s8lefjzeKO0'],['Clip 06','KrY4alP1AoI'],['Clip 07','ToQVbhr4nwE'],['Clip 08','A4XIGkcJbEs'],['Clip 09','rXY0NFgorVY'],['Clip 10','boK4DsN4XuE'],['Clip 11','OmhInGZrV4U'],['Clip 12','t9hYyPbtiAs'],['Clip 13','WGHOGik103U'],['Clip 14','j2xlcFSD0ds'],['Clip 15','eaiiWMtNnFo'],['Clip 16','kx8siajwuuk'],['Clip 17','-cbIqVD89KU'],['Clip 18','Nxde8zNzAF8']];
function render(list,id,kind){
 document.getElementById(id).innerHTML=list.map(([title,video],i)=>`<a class="card" href="https://www.youtube.com/watch?v=${video}" target="_blank" rel="noopener">
 <div class="thumb"><img loading="lazy" src="https://i.ytimg.com/vi/${video}/hqdefault.jpg" alt="${title}" onerror="this.style.opacity=.15"></div>
 <div class="card-meta"><span class="card-title">${title}</span><span class="card-kind">${kind}</span></div></a>`).join('');
}
render(films,'films-grid','film');
render(clips,'clips-grid','clip');
document.getElementById('year').textContent=new Date().getFullYear();
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open)});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
