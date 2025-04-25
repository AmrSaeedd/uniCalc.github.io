window.scrollTo({ top: 0, behavior: "smooth" });
// ----------------------- Global Vars -----------------------
let lastStationPower = 0;
let lastStationCost = 0;
// ------ systemSetttings ------
const systemSettings = {
  panelPower: 400, // قوة اللوح الواحد بالواط
  batteryCapacity: 5000, // سعة البطارية بالأمبير-ساعة
  systemVoltage: 48, // جهد النظام بالفولت
  panelPrice: 4800, // سعر اللوح بالجنيه
  batteryPrice: 3000, // سعر البطارية بالجنيه
  airDensity: 1.225, // كثافة الهواء كجم/م³
  turbineEfficiency: 0.35, // كفاءة التوربين
  capacityFactor: 0.45, // عامل السعة
  turbinePrice: 15000, // سعر التوربين بالجنيه
};
// ------ devices data ------
const devicesData = [
  { id: "lamp", name: "المصابيح", power: 18, hours: 4 },
  { id: "coffee", name: "ماكينات القهوة", power: 100, hours: 2 },
  { id: "computer", name: "أجهزة الكمبيوتر", power: 160, hours: 5 },
  { id: "printer", name: "الطابعات", power: 110, hours: 4 },
  { id: "fridge", name: "الثلاجات", power: 60, hours: 8 },
  { id: "fan", name: "المراوح", power: 30, hours: 4 },
  { id: "conditioning", name: "أجهزة التكييف", power: 1500, hours: 2 },
  { id: "other", name: "أحمال أخرى", power: 20000, hours: 1 },
];
// ----------------------- Navigation -----------------------
function hiddingAll() {
  document
    .querySelectorAll("body .container")
    .forEach((ele) => (ele.style.display = "none"));
}
function backToMainMenu() {
  hiddingAll();
  document.getElementById("main-menu").style.display = "block";
}
// ------ displaying calculators ------
function showSolarBuildingCalculator() {
  hiddingAll();
  const solarBuildingCalculator = document.getElementById(
    "solar-building-calculator"
  );
  solarBuildingCalculator.style.display = "block";
}
function showWindBuildingCalculator() {
  hiddingAll();
  const windBuildingCalculator = document.getElementById(
    "wind-building-calculator"
  );
  windBuildingCalculator.style.display = "block";
}
function showFeasibilityAnalysis() {
  hiddingAll();
  closeModel();
  const feasability = document.getElementById("feasability-analysis");
  document.getElementById("station-power").value = lastStationPower;
  document.getElementById("station-cost").value = lastStationCost;
  feasability.style.display = "block";
}

// ----------------------- results model -----------------------
function showResults(location, results) {
  const resultMenu = document.getElementById("results-model");
  const resultTitle = document.getElementById("results-title");
  const resultsContent = document.getElementById("results-content");
  resultTitle.textContent =
    location == "solar"
      ? "نتائج نظام الطاقة الشمسية"
      : location == "wind"
      ? "نتائج نظام طاقة الرياح"
      : "الجدوي الاقتصادية للمحطة";
  if (location === "feas") {
    document.getElementById("feasability-btn").style.display = "none";
  }
  resultsContent.innerHTML = results
    .map((result) => `<p>${result}</p>`)
    .join("");

  resultMenu.style.display = "block";
}
function closeModel() {
  const resultsModel = document.getElementById("results-model");
  resultsModel.style.display = "none";
}

// ----------------------- Solar Page -----------------------
// ------ minabulate with solar calculator page ------
function showSpecificLoads() {
  const specificLoads = document.getElementById("specific-loads");
  specificLoads.style.display = "block";
  const haveLoads = document.getElementById("alreadyHaveLoad");
  haveLoads.style.display = "none";
}

function backToTotalLoads() {
  const specificLoads = document.getElementById("specific-loads");
  specificLoads.style.display = "none";
  const haveLoads = document.getElementById("alreadyHaveLoad");
  haveLoads.style.display = "block";
}

// ------ Solar Calculations ------
function solarCalculations(solarIrradiance, dailyLoads) {
  // data vars
  let dailyLoadsWh,
    dailyLoadsAh,
    annualyLoadsKwh,
    numPanels,
    numBatteries,
    panelCost,
    batteryCost,
    totalCost,
    systemPower = 0;
  dailyLoadsWh = +dailyLoads;
  // =====> solar panals
  annualyLoadsKwh = (dailyLoadsWh / 1000) * 365;
  let annualPanalOutput =
    (systemSettings.panelPower / 1000) * solarIrradiance * 0.8 * 365;
  numPanels = Math.ceil(annualyLoadsKwh / annualPanalOutput);
  // =====> batteries
  dailyLoadsAh = dailyLoadsWh / systemSettings.systemVoltage;
  numBatteries = Math.ceil(dailyLoadsAh / systemSettings.batteryCapacity);
  // =====> costs
  panelCost = numPanels * systemSettings.panelPrice;
  batteryCost = numBatteries * systemSettings.batteryPrice;
  totalCost = panelCost + batteryCost;
  // =====> system power
  systemPower = (numPanels * systemSettings.panelPower * 0.8) / 1000;

  lastStationPower = systemPower;
  lastStationCost = totalCost;
  let results = [
    `الاستهلاك اليومي (واط - ساعة): ${dailyLoadsWh.toFixed(2)}`,
    `التيار الإجمالي (امبير): ${dailyLoadsAh.toFixed(2)}`,
    `الاستهلاك السنوي (كيلو واط - ساعة): ${parseInt(annualyLoadsKwh)}`,
    `عدد الألواح المطلوبة: ${numPanels}`,
    `عدد البطاريات المطلوبة: ${numBatteries}`,
    `تكلفة الألواح (جنيه): ${panelCost}`,
    `تكلفة البطاريات (جنيه): ${batteryCost}`,
    `التكلفة الإجمالية (جنيه): ${totalCost}`,
    `قدرة النظام (كيلو واط - ساعة): ${systemPower}`,
  ];
  // returning results
  return results;
}

function calculateSolarBuilding() {
  const specificLoads = document.getElementById("specific-loads");
  if (specificLoads.style.display === "block") {
    const solarIrradiance = parseFloat(
      document.getElementById("solar-irradiance2").value
    );
    // calculate loads
    let dailyLoads = 0;
    devicesData.forEach((device) => {
      let quantity =
        parseInt(document.getElementById(`${device.id}-count`).value) || 0;
      dailyLoads += quantity * device.power * device.hours;
    });
    if (!dailyLoads || isNaN(dailyLoads) || dailyLoads <= 0) {
      alert("ادخل قيم صحيحة فى جميع الحقول");
      return;
    }

    // generating results data
    let results = solarCalculations(solarIrradiance, dailyLoads);
    showResults("solar", results);
  } else {
    let dailyLoads = parseInt(document.getElementById("solar-load").value);
    const solarIrradiance = parseFloat(
      document.getElementById("solar-irradiance").value
    );
    if (isNaN(dailyLoads)) {
      alert("ادخل قيم صحيحة فى جميع الحقول");
      return;
    }
    // generating results data
    let results = solarCalculations(solarIrradiance, dailyLoads);

    // putting data in results model
    showResults("solar", results);
  }
}

// ----------------------- wind bage -----------------------
// ------ minabulate with wind calculator page ------
function showSpecificLoadsWind() {
  const specificLoads = document.getElementById("specific-loads-wind");
  specificLoads.style.display = "block";
  const haveLoads = document.getElementById("alreadyHaveLoadWind");
  haveLoads.style.display = "none";
}
function backToTotalLoadsWind() {
  const specificLoads = document.getElementById("specific-loads-wind");
  specificLoads.style.display = "none";
  const haveLoads = document.getElementById("alreadyHaveLoadWind");
  haveLoads.style.display = "block";
}
// ------ wind Calculations ------
function windCalculations(windSpeed, turbineDiam, dailyLoads) {
  // data vars
  let dailyLoadsWh,
    dailyLoadsAh,
    annualyLoadsKwh,
    numTurbines,
    numBatteries,
    turbineCost,
    batteryCost,
    totalCost,
    systemPower = 0;

  dailyLoadsWh = +dailyLoads;
  annualyLoadsKwh = (dailyLoadsWh / 1000) * 365;

  // =====> wind power calcs
  let sweptArea = Math.PI * Math.pow(turbineDiam / 2, 2);
  let theoreticalPower =
    0.5 * systemSettings.airDensity * sweptArea * Math.pow(windSpeed, 3);
  let actualPower = theoreticalPower * systemSettings.turbineEfficiency;

  // =====> calculate turbines
  numTurbines = Math.ceil((annualyLoadsKwh * 1000) / (actualPower * 24 * 365));

  // =====> batteries
  dailyLoadsAh = dailyLoads / systemSettings.systemVoltage;
  numBatteries = Math.ceil(dailyLoadsAh / systemSettings.batteryCapacity);

  // =====> costs
  turbineCost = numTurbines * systemSettings.turbinePrice;
  batteryCost = numBatteries * systemSettings.batteryPrice;
  totalCost = turbineCost + batteryCost;

  // =====> systemPowe
  systemPower = (numTurbines * actualPower) / 1000;

  lastStationPower = systemPower.toFixed(2);
  lastStationCost = totalCost;
  let results = [
    `الاستهلاك اليومي (واط - ساعة): ${dailyLoadsWh.toFixed(2)}`,
    `التيار الإجمالي (امبير): ${dailyLoadsAh.toFixed(2)}`,
    `الاستهلاك السنوي (كيلو واط - ساعة): ${parseInt(annualyLoadsKwh)}`,
    `عدد التوربينات المطلوبة: ${numTurbines}`,
    `عدد البطاريات المطلوبة: ${numBatteries}`,
    `تكلفة التوربينات (جنيه): ${turbineCost}`,
    `تكلفة البطاريات (جنيه): ${batteryCost}`,
    `التكلفة الإجمالية (جنيه): ${totalCost}`,
    `قدرة النظام (كيلو واط - ساعة): ${systemPower.toFixed(2)}`,
  ];
  // returning results
  return results;
}

function calculateWindBuilding() {
  const specificLoads = document.getElementById("specific-loads-wind");
  if (specificLoads.style.display === "block") {
    const turbienDiam = parseInt(document.getElementById("wind-diam2").value);
    const windSpeed = parseFloat(document.getElementById("wind-speed2").value);
    // calculate loads
    let dailyLoads = 0;
    devicesData.forEach((device) => {
      let quantity =
        parseInt(document.getElementById(`${device.id}-count-wind`).value) || 0;
      dailyLoads += quantity * device.power * device.hours;
    });
    if (isNaN(dailyLoads)) {
      alert("ادخل قيم صحيحة فى جميع الحقول");
      return;
    }
    // generating results data
    let results = windCalculations(windSpeed, turbienDiam, dailyLoads);
    showResults("wind", results);
  } else {
    let dailyLoads = parseInt(document.getElementById("wind-load").value);
    const turbienDiam = parseFloat(document.getElementById("wind-diam").value);
    const windSpeed = parseFloat(document.getElementById("wind-speed").value);
    if (isNaN(dailyLoads)) {
      alert("ادخل قيم صحيحة فى جميع الحقول");
      return;
    }
    // generating results data
    let results = windCalculations(windSpeed, turbienDiam, dailyLoads);

    // putting data in results model
    showResults("wind", results);
  }
}
// ----------------------- feasability bage -----------------------
function calculateFeasability() {
  const stationPower = parseFloat(
    document.getElementById("station-power").value
  );
  const stationCost = parseFloat(document.getElementById("station-cost").value);

  let annualEnergyMwh,
    consumptionSaving,
    paybackPeriod,
    fuelSaving,
    carbonSaving,
    jobsCreated,
    govSaving;
  annualEnergyMwh = (stationPower * 5.5 * 365) / 1000;
  consumptionSaving = annualEnergyMwh * 1000 * 1.1;
  paybackPeriod = stationCost / consumptionSaving;
  fuelSaving = annualEnergyMwh * 0.22;
  carbonSaving = annualEnergyMwh * 0.55;
  jobsCreated = (annualEnergyMwh / 1000) * 0.3;
  govSaving = jobsCreated * 500000;

  showResults("feas", [
    `الناتج السنوي (ميجا واط ساعة): ${annualEnergyMwh.toFixed(2)}`,
    `الوفر فى الاستهلاك (جنيه): ${consumptionSaving.toFixed(2)}`,
    `فترة استرداد التكلفة (سنة): ${paybackPeriod.toFixed(2)}`,
    `الوفر فى الوقود الاحفوري (طن): ${fuelSaving.toFixed(2)}`,
    `الوفر فى الانبعاثات الكربونية (طن): ${carbonSaving.toFixed(2)}`,
    `فرص العمل المخلقة (فرصة): ${jobsCreated.toFixed(2)}`,
    `توفير الميزانية الحكومية (جنيه): ${govSaving.toFixed(2)}`,
  ]);
}
