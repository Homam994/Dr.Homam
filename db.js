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
    "name": "د. محمد همام السمان",
    "slogan": "أخصائي تقويم الأسنان",
    "whatsapp": "966536633485",
    "phone": "0536633485",
    "address": "عيادات هارموني سمايل - بريدة، المملكة العربية السعودية",
    "email": "homam.alsmman@gmail.com",
    "contactDesc": "يسعدني الإجابة على استفساراتك وحجز موعدك في أقرب وقت.",
    "about1": "أقدّم لك رعاية تقويمية متخصصة تجمع بين الدقة العلمية والحس الجمالي.",
    "about2": "حاصل على الماجستير السريري في تقويم الأسنان مع خبرة تمتد لأكثر من 6 سنوات.",
    "footerDesc": "ابتسامتك هي انعكاس لثقتك , أنا هنا لأجعلها تتألق.",
    "logoUrl": "https://res.cloudinary.com/dwzew575i/image/upload/v1773612769/oie_iBTOJqT6Lic2_wqfx5q.png",
    "mapEmbed": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3573.87684397454!2d43.92051649999999!3d26.3951662!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x157f57a2469f82ef%3A0x2803b38178f00625!2zSGFybW9ueSBzbWlsZSBjbGluaWNzINi52YrYp9iv2KfYqiDZh9in2LHZhdmI2YbZiiDYs9mF2KfZitmEINmD2YTZitmG2YrZgw!5e0!3m2!1sar!2ssa!4v1773538782924!5m2!1sar!2ssa"
  },
  "hero": {
    "badge": "أخصائي تقويم الأسنان",
    "nameDisplay": "د. محمد همام",
    "tagline": "السمان",
    "subTitle": "ماجستير سريري في تقويم الأسنان والفكين",
    "desc": "أعمل حاليًا في عيادات هارموني سمايل في مدينة بريدة بالمملكة العربية السعودية.",
    "btn1": "احجز موعدك",
    "btn2": "اتصل بنا  📞",
    "heroMedia": "https://res.cloudinary.com/dwzew575i/image/upload/v1773740130/unnamed_u8sguf_mcjawq.jpg",
    "stat1Num": "+500",
    "stat1Label": "حالة ناجحة",
    "stat2Num": "+6",
    "stat2Label": "سنوات خبرة",
    "stat3Num": "4.6",
    "stat3Label": "تقييم المرضى"
  },
  "about": {
    "img": "https://res.cloudinary.com/dwzew575i/video/upload/v1775243012/0315_1_brp5g9.mp4",
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
      "endTime": "21:30",
      "workDays": [
        0,
        1,
        2,
        3,
        4,
        6
      ],
      "specialty": "تقويم الأسنان والفكين",
      "startTime": "13:30",
      "slotDuration": 30
    }
  ],
  "services": [
    {
      "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1774643733/1_zer8ip.jpg",
      "desc": "الخيار الكلاسيكي الفعّال لتصحيح جميع حالات اعوجاج الأسنان بدقة عالية.",
      "name": "التقويم الثابت",
      "iconImg": "https://res.cloudinary.com/dwzew575i/image/upload/v1775851986/1_ttnpna.png"
    },
    {
      "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1774643733/2_dfiac0.jpg",
      "desc": "قوالب شفافة مريحة وغير مرئية لنمط حياة متطلب.",
      "name": "التقويم الشفاف",
      "iconImg": "https://res.cloudinary.com/dwzew575i/image/upload/v1775851986/2_kimbly.png"
    },
    {
      "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1774643733/3_skcoxp.jpg",
      "desc": "تعديل نمو الفك المتقدم أو المتأخر",
      "name": "الأجهزة الوظيفية للأطفال",
      "iconImg": "https://res.cloudinary.com/dwzew575i/image/upload/v1775851986/3_womdfh.png"
    },
    {
      "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1774643733/4_pgpl4i.jpg",
      "desc": "رعاية مبكرة توجّه نمو الفك والأسنان في المرحلة الحيوية.",
      "name": "الكشف المبكر",
      "iconImg": "https://res.cloudinary.com/dwzew575i/image/upload/v1775851986/4_dbw2yz.png"
    },
    {
      "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1774643733/5_obtz4j.jpg",
      "desc": "حلول ثابتة ومتحركة تحافظ على نتائج علاجك.",
      "name": "المثبتات التقويمية",
      "iconImg": "https://res.cloudinary.com/dwzew575i/image/upload/v1775851986/5_obgl8i.png"
    },
    {
      "img": "https://res.cloudinary.com/dwzew575i/image/upload/v1774643733/6_f7mfp5.jpg",
      "desc": "رؤية واضحة قبل بدء العلاج — نمذجة رقمية دقيقة.",
      "name": "التخطيط الرقمي ثلاثي الأبعاد",
      "iconImg": "https://res.cloudinary.com/dwzew575i/image/upload/v1775851986/6_ac3byk.png"
    }
  ],
  "gallery": [
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.34_AM_lkfkzx.jpg",
      "label": "حالة أسنان أمامية منطمرة",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1773524551/WhatsApp_Image_2026-03-15_at_12.39.34_AM_-_Copy_ecvjsw.jpg"
    },
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1774644326/DSC_0648_vy9x5f.jpg",
      "label": "حالة تراجع أسنان أمامية",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1774644326/DSC_0120_Right_aozupp.jpg"
    },
    {
      "after": "https://res.cloudinary.com/dwzew575i/image/upload/v1774644326/DSC_0932_thawf1.jpg",
      "label": "حالة بروز أسنان أمامية",
      "before": "https://res.cloudinary.com/dwzew575i/image/upload/v1774644326/IMG_2977_Rt_occ_v8fu8x.jpg"
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
  "settings": {
    "adminPass": "Homam94++"
  },
  "hoursOverride": [
    {
      "day": "الأحد",
      "time": "13:30 - 21:30",
      "closed": false
    },
    {
      "day": "الاثنين",
      "time": "13:30 - 21:30",
      "closed": false
    },
    {
      "day": "الثلاثاء",
      "time": "13:30 - 21:30",
      "closed": false
    },
    {
      "day": "الأربعاء",
      "time": "13:30 - 21:30",
      "closed": false
    },
    {
      "day": "الخميس",
      "time": "12:00 - 20:00",
      "closed": false
    },
    {
      "day": "الجمعة",
      "time": "09:00 - 13:00",
      "closed": true
    },
    {
      "day": "السبت",
      "time": "13:30 - 21:30",
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