const DB = (() => {
  const SUPABASE_URL = 'https://zvoxfqzbfehmkvbepokb.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp2b3hmcXpiZmVobWt2YmVwb2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTA5NDMsImV4cCI6MjA4OTA4Njk0M30.VNgynNVki7yWXKvpoWQfgRDQ5fGEfjS1KXTs2JKfHM4';
  const TABLE     = 'site_data';
  const ROW_KEY   = 'data';
  const API       = SUPABASE_URL + "/rest/v1/" + TABLE;
  let _cache = null, _lastFetch = 0;
  const TTL  = 30000;

  const DEFAULTS = {
  "clinicInfo": {
    "name": "د. محمدهُمام السمان",
    "slogan": "أخصائي تقويم الأسنان",
    "whatsapp": "966554385134",
    "phone": "0554385134",
    "address": "بريدة، المملكة العربية السعودية",
    "email": "homam.alsmman@gmail.com",
    "contactDesc": "يسعدني الإجابة على استفساراتك وحجز موعدك في أقرب وقت.",
    "about1": "حاصل على الماجستير السريري في تقويم الأسنان مع خبرة تمتد لأكثر من 6 سنوات.",
    "about2": "أعمل حاليًا في عيادات هارموني سمايل في مدينة بريدة بالمملكة العربية السعودية",
    "footerDesc": "ابتسامتك هي انعكاس لثقتك — أنا هنا لأجعلها تتألق.",
    "logoUrl": "data:image/png;base64,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",
    "mapEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.87684397454!2d43.92051649999999!3d26.3951662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x157f57a2469f82ef%3A0x2803b38178f00625!2zSGFybW9ueSBzbWlsZSBjbGluaWNzINi52YrYp9iv2KfYqiDZh9in2LHZhdmI2YbZiiDYs9mF2KfZitmEINmD2YTZitmG2YrZgw!5e0!3m2!1sar!2ssa!4v1773538782924!5m2!1sar!2ssa"
  },
  "hero": {
    "badge": "أخصائي تقويم الأسنان",
    "nameDisplay": "د. محمدهمام",
    "tagline": "السمان",
    "subTitle": "ماجستير سريري في تقويم الأسنان والفكين",
    "desc": "أقدّم لك رعاية تقويمية متخصصة تجمع بين الدقة العلمية والحس الجمالي.",
    "btn1": "احجز موعدك",
    "btn2": "اعرف أكثر",
    "heroMedia": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524151/unnamed_u8sguf_mcjawq.jpg",
    "stat1Num": "+1000",
    "stat1Label": "حالة ناجحة",
    "stat2Num": "+6",
    "stat2Label": "سنوات خبرة",
    "stat3Num": "4.6",
    "stat3Label": "تقييم المرضى"
  },
  "about": {
    "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1773538222/0315-ezgif.com-video-to-webp-converter_2_yyow1f.webp",
    "tag": "عيادات هارموني سمايل",
    "lead": "أؤمن بأن كل ابتسامة قصة فريدة تستحق اهتماماً استثنائياً.",
    "cred1": "الماجستير السريري في تقويم الأسنان",
    "cred2": "عضو الجمعية السعودية لتقويم الأسنان",
    "cred3": "تقنيات تقويم حديثة",
    "cred4": "خبرة أكثر من 6 سنوات",
    "title1": "أخصائي تقويم الأسنان والفكين",
    "title2": "مرخّص في المملكة"
  },
  "social": {
    "instagram": "https://www.instagram.com/dr.homamalsamman",
    "twitter": "",
    "snapchat": "",
    "tiktok": "https://www.tiktok.com/@dr.homamalsamman",
    "facebook": "",
    "youtube": ""
  },
  "doctors": [
    {
      "id": 1,
      "img": "",
      "name": "د. محمدهمام السمان",
      "endTime": "21:00",
      "workDays": [
        0,
        1,
        2,
        3,
        4,
        6
      ],
      "specialty": "تقويم الأسنان والفكين",
      "startTime": "14:00",
      "slotDuration": 30
    }
  ],
  "services": [
    {
      "desc": "الخيار الكلاسيكي الفعّال لتصحيح جميع حالات اعوجاج الأسنان بدقة عالية.",
      "icon": "fa fa-teeth",
      "name": "تقويم معدني"
    },
    {
      "desc": "قوالب شفافة مريحة وغير مرئية لنمط حياة متطلب.",
      "icon": "fa fa-tooth",
      "name": "التقويم الشفاف"
    },
    {
      "desc": "تعديل نمو الفك المتقدم أو المتأخر",
      "icon": "fa fa-child",
      "name": "الأجهزة الوظيفية للأطفال"
    },
    {
      "desc": "رعاية مبكرة توجّه نمو الفك والأسنان في المرحلة الحيوية.",
      "icon": "fa fa-star",
      "name": "الكشف المبكر"
    },
    {
      "desc": "حلول ثابتة ومتحركة تحافظ على نتائج علاجك.",
      "icon": "fa fa-face-smile",
      "name": "المثبتات التقويمية"
    },
    {
      "desc": "رؤية واضحة قبل بدء العلاج — نمذجة رقمية دقيقة.",
      "icon": "fa fa-microscope",
      "name": "التخطيط الرقمي ثلاثي الأبعاد"
    }
  ],
  "gallery": [
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.34_AM_lkfkzx.jpg",
      "label": "حالة أسنان أمامية منطمرة",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.34_AM_-_Copy_ecvjsw.jpg"
    },
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.48_AM_gg9dky.jpg",
      "label": "حالة تراجع أسنان أمامية",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.48_AM_-_Copy_ywhkba.jpg"
    },
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.40.11_AM_be6i8a.jpg",
      "label": "حالة بروز أسنان أمامية",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524552/WhatsApp_Image_2026-03-15_at_12.40.11_AM_-_Copy_ovyvje.jpg"
    }
  ],
  "reviews": [
    {
      "date": "منذ أسبوعين",
      "name": "reem saif",
      "text": "تجربة تقويم الأسنان مع دكتور محمد همام ٥ نجمات ولو اقدر اكثر حطيت\nبصراحة كنت متخوفة اول ما ركبت التقويم بس الحمد لله الدكتور عنده ضمة وضمير بشغله وكل جلسة اشوف تحسن وفرق كبير ما شاء الله\n",
      "rating": 5,
      "initial": "R"
    },
    {
      "date": "قبل 9 أشهر",
      "name": "   Ghaid Re",
      "text": "تجربة تقويم الأسنان مع دكتور محمد همام اكثر من ممتازة من ناحية التشخيص والعلاج المطلوب. وتجربة تنظيف الأسنان باحترافية وبخفة اليد مع دكتور همام ريحاوي، نخبة من الأطباء في القصيم\n",
      "rating": 4,
      "initial": "G"
    },
    {
      "date": "قبل 8 أشهر",
      "name": "   Ghaida Al-harbi",
      "text": "افضل دكتور محمد همام عنده ذمه وضمير بشغله وصراحه النتيجة فوق الخيال وانا لسا مافكيته احسن دكتور بالدنيااااا\n",
      "rating": 5,
      "initial": "G"
    }
  ],
  "hoursOverride": [
    {
      "day": "الأحد",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الاثنين",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الثلاثاء",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الأربعاء",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الخميس",
      "time": "14:00 - 21:00",
      "closed": false
    },
    {
      "day": "الجمعة",
      "time": "09:00 - 13:00",
      "closed": true
    },
    {
      "day": "السبت",
      "time": "14:00 - 21:00",
      "closed": false
    }
  ],
  "fonts": {
    "body": "Noto Sans Arabic",
    "bodyUrl": "Noto+Sans+Arabic:wght@300;400;700",
    "display": "Noto Naskh Arabic",
    "displayUrl": "Noto+Naskh+Arabic:wght@400;500;600;700"
  }
};

  function hdrs(extra){
    return Object.assign({
      'Content-Type':'application/json',
      'apikey':SUPABASE_KEY,
      'Authorization':'Bearer '+SUPABASE_KEY,
      'Prefer':'return=representation',
    }, extra);
  }

  function deepMerge(def,saved){
    const res=JSON.parse(JSON.stringify(def));
    if(!saved||typeof saved!=="object")return res;
    Object.keys(saved).forEach(k=>{
      if(saved[k]!==null&&typeof saved[k]==="object"&&!Array.isArray(saved[k])&&res[k]&&typeof res[k]==="object")
        res[k]={...res[k],...saved[k]};
      else res[k]=saved[k];
    });
    return res;
  }

  async function read(){
    const now=Date.now();
    if(_cache&&now-_lastFetch<TTL)return _cache;
    try{
      const r=await fetch(API+"?key=eq."+ROW_KEY+"&select=value",{headers:hdrs()});
      if(!r.ok)throw new Error("fetch "+r.status);
      const rows=await r.json();
      if(!rows.length){
        await fetch(API,{method:"POST",headers:hdrs(),body:JSON.stringify({key:ROW_KEY,value:DEFAULTS})});
        _cache=JSON.parse(JSON.stringify(DEFAULTS));
      }else{
        _cache=deepMerge(DEFAULTS,rows[0].value);
      }
      _lastFetch=now;return _cache;
    }catch(e){
      console.warn("DB read error:",e.message);
      return _cache||JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  async function write(data){
    const r=await fetch(API+"?key=eq."+ROW_KEY,{method:"PATCH",headers:hdrs(),body:JSON.stringify({value:data})});
    if(!r.ok){
      const r2=await fetch(API,{method:"POST",headers:hdrs(),body:JSON.stringify({key:ROW_KEY,value:data})});
      if(!r2.ok)throw new Error("write failed: "+r2.status);
    }
    _cache=JSON.parse(JSON.stringify(data));_lastFetch=Date.now();
    return true;
  }

  function getConfig(){return{url:SUPABASE_URL};}
  function isReady(){return true;}
  return{read,write,getConfig,isReady,DEFAULTS};
})();