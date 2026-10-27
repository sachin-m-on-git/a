// Centralized database of all project links
const LINKS_DATA = [
  {
    id: "2-1",
    num: "2(1)",
    key: "1",
    title: "2(1) tem",
    name: "Temperature Sensor (TMP36)",
    description: "Analog temperature sensor reading with Arduino simulation",
    url: "https://www.tinkercad.com/things/6RG50Y2rGx4-powerful-leelo/editel?sharecode=4ULiiwrtmz3QHaYwnCj-AFcoHeLY07G2cMXMO_MJogs",
    tinkercad_name: "powerful-leelo",
    aliases: ["2-1", "2.1", "21", "2(1)", "tem", "temperature", "1"],
    tag: "Sensor"
  },
  {
    id: "2-2",
    num: "2(2)",
    key: "2",
    title: "2(2) light",
    name: "Light Sensor (LDR / Photoresistor)",
    description: "Light dependent resistor circuit for ambient light detection",
    url: "https://www.tinkercad.com/things/dte5cn2eNCl-swanky-bombul-rottis/editel?returnTo=https%3A%2F%2Fwww.tinkercad.com%2Fdashboard&sharecode=UlIAOM-2J-Oj8nXxs2fbhSi9xCaiFqkVYD2lvWvn7T0",
    tinkercad_name: "swanky-bombul-rottis",
    aliases: ["2-2", "2.2", "22", "2(2)", "light", "ldr", "2"],
    tag: "Sensor"
  },
  {
    id: "2-3",
    num: "2(3)",
    key: "3",
    title: "2(3) infrared",
    name: "Infrared (IR) Sensor Circuit",
    description: "Infrared sensor detection and signal processing",
    url: "https://www.tinkercad.com/things/eSkIRDU4aKi-grand-leelo/editel?sharecode=TLehiV7P1y3rcRceMLs_OZVbA949cMsUdCCZlXPwc0I",
    tinkercad_name: "grand-leelo",
    aliases: ["2-3", "2.3", "23", "2(3)", "infrared", "ir", "3"],
    tag: "Sensor"
  },
  {
    id: "4",
    num: "4",
    key: "4",
    title: "4. servo",
    name: "Servo Motor Control",
    description: "PWM angle positioning control for micro servo motor",
    url: "https://www.tinkercad.com/things/etKr4tkm2iD-p-4/editel?sharecode=V5o7JgLB0l5VBBEDF668ujiopiggjPSDLP3LM1qmWlE",
    tinkercad_name: "p-4",
    aliases: ["4", "servo", "4.servo", "p-4", "p4"],
    tag: "Actuator"
  },
  {
    id: "5",
    num: "5",
    key: "5",
    title: "5. tmp and lcd",
    name: "TMP36 Temperature Sensor & 16x2 LCD",
    description: "Live temperature telemetry displayed on 16x2 alphanumeric LCD",
    url: "https://www.tinkercad.com/things/5f5cNXvHSrk-p-5/editel?sharecode=kItaNyBj7uE8MYyxi1ugwN90EMJ_oDIrH6KqFCw-HGY",
    tinkercad_name: "p-5",
    aliases: ["5", "tmp", "lcd", "tmp-lcd", "5.tmp", "p-5", "p5"],
    tag: "Display"
  },
  {
    id: "6",
    num: "6",
    key: "6",
    title: "6. soil",
    name: "Soil Moisture Sensor",
    description: "Analog soil moisture resistance detection for automated irrigation",
    url: "https://www.tinkercad.com/things/0ntP9RiftZO-p-6/editel?sharecode=dZttDuat62DW4nM-Dub8iRJAP6VMjVKHnzVr3jzC8Ao",
    tinkercad_name: "p-6",
    aliases: ["6", "soil", "soil-moisture", "6.soil", "p-6", "p6"],
    tag: "Sensor"
  },
  {
    id: "7",
    num: "7",
    key: "7",
    title: "7. ultrasonic and lcd",
    name: "Ultrasonic Distance Sensor & LCD Display",
    description: "HC-SR04 sonar pulse timing with live distance readouts on LCD",
    url: "https://www.tinkercad.com/things/4bvKI3D1Z6Z-p-7/editel?returnTo=https%3A%2F%2Fwww.tinkercad.com%2Fdashboard&sharecode=d1C7PYZAzStAWnyCVD1D5oxuyqScMWCq0A8reqTXR9A",
    tinkercad_name: "p-7",
    aliases: ["7", "ultrasonic-lcd", "ultra-lcd", "7.ultrasonic", "p-7", "p7"],
    tag: "Measurement"
  },
  {
    id: "8",
    num: "8",
    key: "8",
    title: "8. ultrasonic and led",
    name: "Ultrasonic Distance Sensor & LED Indicators",
    description: "Proximity range alerts with multi-stage LED threshold triggers",
    url: "https://www.tinkercad.com/things/8cACiwUpeTt-smooth-duup-jaiks/editel?sharecode=arZ3sdP81IAvhplESDg5fYp9kLNZ_Q7QxFCFKlVhpZc",
    tinkercad_name: "smooth-duup-jaiks",
    aliases: ["8", "ultrasonic-led", "ultra-led", "8.ultrasonic", "p-8", "p8"],
    tag: "Measurement"
  },
  {
    id: "10",
    num: "10",
    key: "0",
    title: "10. real world sce, light sensor",
    name: "Real World Scenario: Light Sensor Automation",
    description: "Automated street lamp / daylight ambient threshold controller",
    url: "https://www.tinkercad.com/things/dte5cn2eNCl-swanky-bombul-rottis/editel?returnTo=https%3A%2F%2Fwww.tinkercad.com%2Fdashboard&sharecode=UlIAOM-2J-Oj8nXxs2fbhSi9xCaiFqkVYD2lvWvn7T0",
    tinkercad_name: "swanky-bombul-rottis",
    aliases: ["10", "real-world", "light-sensor", "10.real", "p-10", "p10"],
    tag: "Automation"
  }
];

// Helper to look up an item by path or alias
function findLinkByRoute(route) {
  if (!route) return null;
  const clean = route.replace(/^\/+|\/+$/g, "").toLowerCase().trim();
  if (!clean) return null;

  for (const item of LINKS_DATA) {
    if (item.id.toLowerCase() === clean) return item;
    if (item.aliases.some(a => a.toLowerCase() === clean)) return item;
  }
  return null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { LINKS_DATA, findLinkByRoute };
}
