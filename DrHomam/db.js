const DB = (() => {
  let BIN_ID  = localStorage.getItem('db_bin_id')  || '';
  let API_KEY = localStorage.getItem('db_api_key') || '';
  const BASE  = 'https://api.jsonbin.io/v3';
  let _cache  = null, _lastFetch = 0;
  const TTL   = 30000;

  const DEFAULTS = {
    clinicInfo: {
      name:       'د. اسمك الكريم',
      slogan:     'أخصائي تقويم الأسنان',
      whatsapp:   '966500000000',
      phone:      '0500000000',
      address:    'الرياض، المملكة العربية السعودية',
      email:      'dr@example.com',
      contactDesc:'يسعدني الإجابة على استفساراتك وحجز موعدك في أقرب وقت.',
      about1:     'حاصل على البورد التخصصي في تقويم الأسنان مع خبرة تمتد لأكثر من ثماني سنوات في علاج مختلف حالات التقويم.',
      about2:     'أؤمن بأن كل مريض يستحق خطة علاجية مخصصة تراعي احتياجاته الفريدة، مع الحرص على تقديم أعلى معايير الرعاية والدقة.',
      footerDesc: 'ابتسامتك هي انعكاس لثقتك — أنا هنا لأجعلها تتألق.',
      logoUrl:    '',
    },
    hero: {
      badge:      'أخصائي تقويم الأسنان',
      nameDisplay:'د. اسمك الكريم',
      tagline:    'ابتسامتك. هويتك.',
      subTitle:   'Orthodontic Specialist · تقويم الأسنان',
      desc:       'أقدّم لك رعاية تقويمية متخصصة تجمع بين الدقة العلمية والحس الجمالي، لأمنحك الابتسامة التي تستحقها.',
      btn1:       'احجز موعدك',
      btn2:       'اعرف أكثر',
      heroMedia:  '',
      stat1Num:'+1000', stat1Label:'حالة ناجحة',
      stat2Num:'+8',    stat2Label:'سنوات خبرة',
      stat3Num:'4.9',   stat3Label:'تقييم المرضى',
    },
    about: {
      img:   '',
      tag:   'منذ 2016',
      lead:  'أؤمن بأن كل ابتسامة قصة فريدة تستحق اهتماماً استثنائياً.',
      cred1: 'بورد تخصصي في تقويم الأسنان',
      cred2: 'عضو الجمعية السعودية لتقويم الأسنان',
      cred3: 'تقنيات تقويم حديثة وشفافة',
      cred4: 'خبرة أكثر من 8 سنوات',
    },
    social: { instagram:'', twitter:'', snapchat:'', tiktok:'', facebook:'', youtube:'' },
    doctors: [
      {id:1, name:'د. اسمك الكريم', specialty:'تقويم الأسنان', img:'',
       workDays:[0,1,2,3,4], startTime:'9:00', endTime:'17:00', slotDuration:30},
    ],
    services: [
      {icon:'fa fa-teeth',       name:'تقويم معدني',         desc:'الخيار الكلاسيكي الفعّال لتصحيح جميع حالات اعوجاج الأسنان بدقة عالية وتكلفة مناسبة.'},
      {icon:'fa fa-tooth',       name:'تقويم شفاف (Clear)',   desc:'ابتسم بثقة خلال العلاج — قوالب شفافة مريحة وغير مرئية لنمط حياة متطلب.'},
      {icon:'fa fa-star',        name:'تقويم الأسنان الخلفي', desc:'تقويم خلف الأسنان يمنحك كفاءة العلاج المعدني مع خصوصية كاملة لا يراها أحد.'},
      {icon:'fa fa-child',       name:'تقويم الأطفال',        desc:'رعاية مبكرة ومتخصصة توجّه نمو الفك والأسنان في المرحلة الحيوية بأسلوب ودي وآمن.'},
      {icon:'fa fa-face-smile',  name:'الاستبقاء بعد التقويم',desc:'حلول ثابتة ومتحركة تحافظ على نتائج علاجك وتضمن استمرار ابتسامتك المثالية.'},
      {icon:'fa fa-microscope',  name:'التخطيط الرقمي ثلاثي الأبعاد',desc:'رؤية واضحة قبل بدء العلاج — نمذجة رقمية دقيقة تُريك نتيجتك قبل أن تبدأ.'},
    ],
    gallery: [],
    reviews: [
      {name:'أبو سلطان', initial:'أ', rating:5, text:'الدكتور محترف جداً وصبور. الابتسامة تغيرت بشكل لم أتخيله. شكراً جزيلاً.', date:'منذ أسبوعين'},
      {name:'نورة العتيبي', initial:'ن', rating:5, text:'تجربة رائعة من أول زيارة. التقويم الشفاف كان أفضل قرار اتخذته.', date:'منذ شهر'},
      {name:'م. الشمري', initial:'م', rating:5, text:'الدقة والاحترافية واضحة في كل تفصيل. النتائج تكلم نفسها.', date:'منذ 3 أشهر'},
    ],
    hoursOverride: null,
  };

  function deepMerge(def, saved){
    const res=JSON.parse(JSON.stringify(def));
    if(!saved||typeof saved!=='object')return res;
    Object.keys(saved).forEach(k=>{
      if(saved[k]!==null&&typeof saved[k]==='object'&&!Array.isArray(saved[k])&&res[k]&&typeof res[k]==='object')
        res[k]={...res[k],...saved[k]};
      else res[k]=saved[k];
    });
    return res;
  }

  function hdrs(){return{'Content-Type':'application/json','X-Master-Key':API_KEY,'X-Bin-Versioning':'false'}}
  function ok(){return !!(BIN_ID&&API_KEY)}

  async function read(){
    if(!ok())return JSON.parse(JSON.stringify(DEFAULTS));
    const now=Date.now();
    if(_cache&&now-_lastFetch<TTL)return _cache;
    try{
      const r=await fetch(`${BASE}/b/${BIN_ID}/latest`,{headers:hdrs()});
      if(!r.ok)throw new Error(r.status);
      const j=await r.json();
      _cache=deepMerge(DEFAULTS,j.record);
      _lastFetch=now;return _cache;
    }catch(e){return _cache||JSON.parse(JSON.stringify(DEFAULTS))}
  }

  async function write(data){
    if(!ok())throw new Error('DB not configured');
    const r=await fetch(`${BASE}/b/${BIN_ID}`,{method:'PUT',headers:hdrs(),body:JSON.stringify(data)});
    if(!r.ok)throw new Error('write failed: '+r.status);
    _cache=JSON.parse(JSON.stringify(data));_lastFetch=Date.now();
    return true;
  }

  function configure(b,k){BIN_ID=b;API_KEY=k;localStorage.setItem('db_bin_id',b);localStorage.setItem('db_api_key',k);_cache=null;_lastFetch=0;}
  function getConfig(){return{binId:BIN_ID,apiKey:API_KEY}}
  function isReady(){return ok()}

  return{read,write,configure,getConfig,isReady,DEFAULTS};
})();
