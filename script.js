// إعدادات النظام
const systemSettings = {
  panelPower: 400, // قوة اللوح الواحد بالواط
  batteryCapacity: 5000, // سعة البطارية بالأمبير-ساعة
  systemVoltage: 48, // جهد النظام بالفولت
  panelPrice: 2000, // سعر اللوح بالجنيه
  batteryPrice: 3000, // سعر البطارية بالجنيه
  windSpeed: 6.5, // سرعة الرياح م/ث
  airDensity: 1.225, // كثافة الهواء كجم/م³
  turbineEfficiency: 0.35, // كفاءة التوربين
  capacityFactor: 0.45, // عامل السعة
  turbinePrice: 15000, // سعر التوربين بالجنيه
};

// أجهزة المبنى مع استهلاكها
const devicesData = [
  { id: "lights", name: "المصابيح", power: 18, hours: 4 },
  { id: "coffee", name: "ماكينات القهوة", power: 100, hours: 2 },
  { id: "computers", name: "أجهزة الكمبيوتر", power: 160, hours: 5 },
  { id: "printers", name: "الطابعات", power: 110, hours: 4 },
  { id: "fridge", name: "الثلاجات", power: 60, hours: 8 },
  { id: "fans", name: "المراوح", power: 30, hours: 4 },
  { id: "ac", name: "أجهزة التكييف", power: 1500, hours: 2 },
  { id: "other", name: "أحمال أخرى", power: 20000, hours: 1 },
];

// متغيرات لتخزين نتائج الحسابات الأخيرة
let lastSystemCost = 0;
let lastSystemCapacity = 0;

// عرض القائمة الرئيسية
function showMainMenu() {
  hideAllSections();
  document.getElementById("main-menu").style.display = "block";
}

// عرض حاسبة الطاقة الشمسية
function showSolarBuildingCalculator() {
  hideAllSections();
  document.getElementById("solar-building-calculator").style.display = "block";
  document.getElementById("solar-area").focus();
}

// عرض حاسبة طاقة الرياح
function showWindBuildingCalculator() {
  hideAllSections();
  document.getElementById("wind-building-calculator").style.display = "block";
  document.getElementById("wind-area").focus();
}

// عرض تحليل الجدوى
function showFeasibilityAnalysis() {
  hideAllSections();
  document.getElementById("feasibility-analysis").style.display = "block";
  document.getElementById("station-capacity").focus();
}

// إخفاء جميع الأقسام
function hideAllSections() {
  const sections = document.querySelectorAll(".container");
  sections.forEach((section) => {
    section.style.display = "none";
  });
}

// التعامل مع ضغط مفتاح Enter
function handleEnter(event, nextFieldId, action = "") {
  if (event.key === "Enter") {
    event.preventDefault();
    if (nextFieldId) {
      document.getElementById(nextFieldId).focus();
    } else if (action) {
      window[action]();
    }
  }
}

// حساب متطلبات المبنى بالطاقة الشمسية
function calculateSolarBuilding() {
  try {
    // قراءة المدخلات
    const area = parseFloat(document.getElementById("solar-area").value);
    const numFloors = parseInt(document.getElementById("solar-floors").value);

    // حساب استهلاك الأجهزة
    let dailyWh = 0;
    devicesData.forEach((device) => {
      const quantity =
        parseInt(document.getElementById(`solar-${device.id}`).value) || 0;
      dailyWh += device.power * quantity * device.hours;
    });

    const annualEnergyKwh = (dailyWh * 365) / 1000;

    // حساب عدد الألواح الشمسية المطلوبة
    const solarIrradiance = 5.5; // kWh/m²/day
    const panelOutput =
      (systemSettings.panelPower / 1000) * solarIrradiance * 0.8 * 365;
    const numPanels = Math.ceil(annualEnergyKwh / panelOutput);

    // حساب عدد البطاريات المطلوبة
    const dailyEnergyAh = dailyWh / systemSettings.systemVoltage;
    const numBatteries = Math.ceil(
      dailyEnergyAh / systemSettings.batteryCapacity
    );

    // حساب التكاليف
    const panelCost = numPanels * systemSettings.panelPrice;
    const batteryCost = numBatteries * systemSettings.batteryPrice;
    const totalCost = panelCost + batteryCost;

    // قدرة النظام بالكيلوواط
    const systemCapacity = (numPanels * systemSettings.panelPower) / 1000;

    // تخزين النتائج لاستخدامها في تحليل الجدوى
    lastSystemCost = totalCost;
    lastSystemCapacity = systemCapacity * 1000; // تحويل إلى واط

    // عرض النتائج
    showResults(
      "نتائج نظام الطاقة الشمسية",
      [
        `الاستهلاك اليومي (واط-ساعة): ${dailyWh.toFixed(2)}`,
        `الاستهلاك اليومي (أمبير-ساعة): ${dailyEnergyAh.toFixed(2)}`,
        `التيار الإجمالي (أمبير): ${(
          dailyWh / systemSettings.systemVoltage
        ).toFixed(2)}`,
        `الاستهلاك السنوي: ${annualEnergyKwh.toFixed(2)} كيلوواط-ساعة`,
        `عدد الألواح المطلوبة: ${numPanels}`,
        `عدد البطاريات المطلوبة: ${numBatteries}`,
        `تكلفة الألواح: ${panelCost.toLocaleString()} جنيه`,
        `تكلفة البطاريات: ${batteryCost.toLocaleString()} جنيه`,
        `التكلفة الإجمالية: ${totalCost.toLocaleString()} جنيه`,
        `قدرة النظام: ${systemCapacity.toFixed(2)} كيلوواط`,
      ],
      true
    );
  } catch (error) {
    alert("الرجاء إدخال قيم صحيحة في جميع الحقول");
    console.error(error);
  }
}

// حساب متطلبات المبنى بطاقة الرياح
function calculateWindBuilding() {
  try {
    // قراءة المدخلات
    const area = parseFloat(document.getElementById("wind-area").value);
    const numFloors = parseInt(document.getElementById("wind-floors").value);
    const windSpeed =
      parseFloat(document.getElementById("wind-speed").value) ||
      systemSettings.windSpeed;
    const turbineDiam =
      parseFloat(document.getElementById("wind-diameter").value) ||
      systemSettings.turbineDiameter;

    // حساب استهلاك الأجهزة
    let dailyWh = 0;
    devicesData.forEach((device) => {
      const quantity =
        parseInt(document.getElementById(`wind-${device.id}`).value) || 0;
      dailyWh += device.power * quantity * device.hours;
    });

    const annualEnergyKwh = (dailyWh * 365) / 1000;

    // حساب طاقة الرياح
    const sweptArea = Math.PI * Math.pow(turbineDiam / 2, 2);
    const theoreticalPower =
      0.5 * systemSettings.airDensity * sweptArea * Math.pow(windSpeed, 3);
    const actualPower = theoreticalPower * systemSettings.turbineEfficiency;

    // عدد التوربينات المطلوبة
    const numTurbines = Math.ceil(
      (annualEnergyKwh * 1000) / (actualPower * 24 * 365)
    );

    // حساب عدد البطاريات المطلوبة
    const dailyEnergyAh = dailyWh / systemSettings.systemVoltage;
    const numBatteries = Math.ceil(
      dailyEnergyAh / systemSettings.batteryCapacity
    );

    // حساب التكاليف
    const turbineCost = numTurbines * systemSettings.turbinePrice;
    const batteryCost = numBatteries * systemSettings.batteryPrice;
    const totalCost = turbineCost + batteryCost;

    // قدرة النظام بالكيلوواط
    const systemCapacity = (numTurbines * actualPower) / 1000;

    // تخزين النتائج لاستخدامها في تحليل الجدوى
    lastSystemCost = totalCost;
    lastSystemCapacity = systemCapacity * 1000; // تحويل إلى واط

    // عرض النتائج
    showResults(
      "نتائج نظام طاقة الرياح",
      [
        `الاستهلاك اليومي (واط-ساعة): ${dailyWh.toFixed(2)}`,
        `الاستهلاك اليومي (أمبير-ساعة): ${dailyEnergyAh.toFixed(2)}`,
        `التيار الإجمالي (أمبير): ${(
          dailyWh / systemSettings.systemVoltage
        ).toFixed(2)}`,
        `الاستهلاك السنوي: ${annualEnergyKwh.toFixed(2)} كيلوواط-ساعة`,
        `عدد التوربينات المطلوبة: ${numTurbines}`,
        `عدد البطاريات المطلوبة: ${numBatteries}`,
        `تكلفة التوربينات: ${turbineCost.toLocaleString()} جنيه`,
        `تكلفة البطاريات: ${batteryCost.toLocaleString()} جنيه`,
        `التكلفة الإجمالية: ${totalCost.toLocaleString()} جنيه`,
        `قدرة النظام: ${systemCapacity.toFixed(2)} كيلوواط`,
      ],
      true
    );
  } catch (error) {
    alert("الرجاء إدخال قيم صحيحة في جميع الحقول");
    console.error(error);
  }
}

// حساب نتائج المحطة
function calculateStationResults() {
  try {
    const capacity =
      parseFloat(document.getElementById("station-capacity").value) * 1000; // تحويل إلى واط
    const cost = parseFloat(document.getElementById("station-cost").value);

    const results = calculateHomeStation(capacity, cost);

    // تخزين النتائج لاستخدامها لاحقاً إذا لزم الأمر
    lastSystemCost = cost;
    lastSystemCapacity = capacity;

    showResults(
      "نتائج تحليل المحطة المتجددة",
      [
        `قدرة المحطة: ${(capacity / 1000).toFixed(
          2
        )} كيلوواط | التكلفة: ${cost.toLocaleString()} جنيه`,
        `1. الناتج السنوي: ${results.annualOutput.toFixed(2)} ميجاواط ساعة`,
        `2. الوفر في الاستهلاك: ${results.consumptionSaving.toLocaleString()} جنيه`,
        `3. فترة استرداد التكلفة: ${results.paybackPeriod.toFixed(1)} سنوات`,
        `4. توفير الوقود: ${results.fuelSaving.toFixed(2)} ميجاواط ساعة`,
        `5. تخفيض الانبعاثات: ${results.carbonSaving.toFixed(2)} طن CO2`,
        `6. فرص العمل المخلقة: ${results.jobsCreated.toFixed(2)} فرصة عمل`,
        `7. توفير الميزانية الحكومية: ${results.govSaving.toLocaleString()} جنيه`,
      ],
      false
    );
  } catch (error) {
    alert("الرجاء إدخال قيم رقمية صحيحة");
    console.error(error);
  }
}

// حساب جدوى المحطة المنزلية
function calculateHomeStation(systemCapacity, systemCost) {
  const annualOutput = (systemCapacity * 12 * 365) / 1000000; // ميجاواط ساعة/سنة

  return {
    annualOutput: annualOutput,
    consumptionSaving: annualOutput * 0.6 * 1000, // افتراض سعر 0.6 جنيه/كيلوواط-ساعة
    paybackPeriod: systemCost / (annualOutput * 0.6 * 1000),
    fuelSaving: annualOutput * 0.22, // افتراض 0.22 ميجاواط ساعة وقود/ميجاواط ساعة كهرباء
    carbonSaving: annualOutput * 0.55, // افتراض 0.55 طن CO2/ميجاواط ساعة
    jobsCreated: annualOutput * 0.3, // افتراض 0.3 فرصة عمل/ميجاواط ساعة
    govSaving: annualOutput * 0.3 * 500000, // افتراض توفير 500,000 جنيه/فرصة عمل
  };
}

// عرض النتائج في نافذة منبثقة
function showResults(title, results, showFeasibilityBtn) {
  const modal = document.getElementById("results-modal");
  const titleElement = document.getElementById("results-title");
  const contentElement = document.getElementById("results-content");
  const feasibilityBtn = document.getElementById("feasibility-btn");

  titleElement.textContent = title;
  contentElement.innerHTML = results
    .map((result) => `<p>${result}</p>`)
    .join("");

  if (showFeasibilityBtn) {
    feasibilityBtn.style.display = "block";
  } else {
    feasibilityBtn.style.display = "none";
  }

  modal.style.display = "block";
}

// إغلاق النافذة المنبثقة
function closeModal() {
  document.getElementById("results-modal").style.display = "none";
}

// عرض تحليل الجدوى من النتائج
function showFeasibilityFromResults() {
  closeModal();
  showFeasibilityAnalysis();
  document.getElementById("station-capacity").value = (
    lastSystemCapacity / 1000
  ).toFixed(2);
  document.getElementById("station-cost").value = lastSystemCost;
  document.getElementById("station-cost").focus();
}

// تهيئة التطبيق عند التحميل
window.onload = function () {
  showMainMenu();

  // إغلاق النافذة المنبثقة عند النقر خارجها
  window.onclick = function (event) {
    const modal = document.getElementById("results-modal");
    if (event.target == modal) {
      closeModal();
    }
  };
};
