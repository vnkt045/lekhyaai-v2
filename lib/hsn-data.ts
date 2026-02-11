
export const HSN_DATA = [
    { code: "998313", description: "Information technology (IT) consulting and support services", gstRate: 18 },
    { code: "998314", description: "Information technology (IT) design and development services", gstRate: 18 },
    { code: "8471", description: "Automatic data processing machines and units thereof (Computers)", gstRate: 18 },
    { code: "8517", description: "Telephones for cellular networks or for other wireless networks", gstRate: 18 },
    { code: "9954", description: "Construction services", gstRate: 18 },
    { code: "9963", description: "Accommodation, food and beverage services", gstRate: 5 },
    { code: "9972", description: "Real estate services", gstRate: 12 },
    { code: "9996", description: "Recreational, cultural and sporting services", gstRate: 18 },
    { code: "6109", description: "T-shirts, singlets and other vests, knitted or crocheted", gstRate: 5 },
    { code: "6203", description: "Men's or boys' suits, ensembles, jackets, blazers, trousers", gstRate: 12 },
    { code: "0401", description: "Milk and cream, not concentrated nor containing added sugar", gstRate: 0 },
    { code: "0402", description: "Milk and cream, concentrated or containing added sugar", gstRate: 5 },
    { code: "1006", description: "Rice", gstRate: 0 }, // Unbranded 0, Branded 5
    { code: "1101", description: "Wheat or meslin flour", gstRate: 0 },
    { code: "3004", description: "Medicaments (excluding goods of heading 3002, 3005 or 3006)", gstRate: 12 },
    { code: "8703", description: "Motor cars and other motor vehicles principally designed for the transport of persons", gstRate: 28 },
    { code: "9403", description: "Other furniture and parts thereof", gstRate: 18 },
    { code: "7214", description: "Other bars and rods of iron or non-alloy steel", gstRate: 18 },
    { code: "2523", description: "Portland cement, aluminous cement, slag cement", gstRate: 28 },
    { code: "4011", description: "New pneumatic tyres, of rubber", gstRate: 28 }
];

export const getHSNDetails = (code: string) => {
    return HSN_DATA.find(h => h.code === code);
};

export const searchHSN = (query: string) => {
    const q = query.toLowerCase();
    return HSN_DATA.filter(h =>
        h.code.includes(q) || h.description.toLowerCase().includes(q)
    );
};
