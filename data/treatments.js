// Blisse.ee Hoolduste andmed
const treatments = {
  // ============ SALONGIHOOLDUSED ============

  // KEHAHOOLDUSED
  kehahooldused: [
    {
      slug: 'lpg-massaaz',
      name: 'LPG Massaaž',
      description: 'LPG massaaž on tõhus meetod tselluliidi vähendamiseks ja naha pinguldamiseks. Mehhaaniline vakuummassaaž stimuleerib vereringet ja lümfivoolu.',
      price: 79,
      trialPrice: 29,
      duration: '60 min',
      image: 'images/treatments/lpg-massage.jpg',
      benefits: ['Tselluliidi vähendamine', 'Naha pinguldamine', 'Vereringe parandamine', 'Lümfivoolu stimuleerimine'],
      sessions: '5-10 seanssi'
    },
    {
      slug: 'kruolipoluus',
      name: 'Krüolipolüüs',
      description: 'Krüolipolüüs on mitteinvasiivne rasvakoe külmutamise meetod. Rasvarakud hävitatakse kontrollitud külmaga ilma operatsioonita.',
      price: 99,
      trialPrice: 59,
      duration: '45-60 min',
      image: 'images/treatments/cryolipolysis.jpg',
      benefits: ['Lokaalne rasvapõletus', 'Püsiv tulemus', 'Valutu protseduur', 'Taastusaeg puudub'],
      sessions: '1-3 seanssi'
    },
    {
      slug: 'reshape-therapy',
      name: 'ReShape Teraapia',
      description: 'ReShape teraapia kombineerib mikrovibratsioonid kolme tehnoloogiaga nahatoonuse ja kehakontuuri parandamiseks.',
      price: 33,
      duration: '30-45 min',
      image: 'images/treatments/hero-model-1.jpg',
      benefits: ['Naha toonuse parandamine', 'Tselluliidi vähendamine', 'Sünnitusjärgne taastumine', 'Kehakontuuri modelleerimine'],
      sessions: '5-8 seanssi'
    },
    {
      slug: 'cold-lipo',
      name: 'Cold Lipo Laser',
      description: 'Cold Lipo Laser kasutab madala taseme laserkiirgust rasvakudede lagundamiseks ja ainevahetuse kiirendamiseks.',
      price: 79,
      duration: '30-45 min',
      image: 'images/treatments/hero-model-2.jpg',
      benefits: ['Rasvakoe vähendamine', 'Ainevahetuse kiirendamine', 'Mitteinvasiivne', 'Kiire protseduur'],
      sessions: '3-6 seanssi'
    },
    {
      slug: 'kavitatsioon',
      name: 'Kavitatsioon',
      description: 'Kavitatsioon on ultrahelipõhine meetod, mis tekitab mikromulle rasvakoes, aidates lagundada rasvarakke.',
      price: 69,
      duration: '30-45 min',
      image: 'images/treatments/hero-model-3.jpg',
      benefits: ['Rasvakoe lagundamine', 'Tselluliidi vähendamine', 'Valutu protseduur', 'Kohene tulemus'],
      sessions: '4-8 seanssi'
    }
  ],

  // NÄOHOOLDUSED
  naohooldused: [
    {
      slug: 'rf-lifting-naole',
      name: 'RF Lifting Näole',
      description: 'RF lifting kasutab raadiosagedusenergiat kollageeni tootmise stimuleerimiseks ja naha pinguldamiseks.',
      price: 79,
      duration: '45-60 min',
      image: 'images/gallery/1.jpg',
      benefits: ['Kortsude vähendamine', 'Naha pinguldamine', 'Kollageeni tootmine', 'Näo kontuuri parandamine'],
      sessions: '6-8 seanssi',
      minAge: 30
    },
    {
      slug: 'prestige-reshapelift',
      name: 'Prestige ReShapeLift Näohooldus',
      description: 'Premium näohooldus, mis kombineerib mitut tehnoloogiat sügavaks naha noorendamiseks ja liftinguks.',
      price: 99,
      duration: '60-75 min',
      image: 'images/gallery/2.jpg',
      benefits: ['Sügav noorendamine', 'Näo modelleerimine', 'Kortsude silumine', 'Naha elastsuse parandamine'],
      sessions: '4-6 seanssi',
      minAge: 35
    },
    {
      slug: 'kruolipoluus-naole',
      name: 'Krüolipolüüs Näole',
      description: 'Näole kohandatud krüolipolüüs topeltlõua ja näokontuuride korrigeerimiseks.',
      price: 79,
      duration: '30-45 min',
      image: 'images/gallery/3.jpg',
      benefits: ['Topeltlõua vähendamine', 'Näokontuuri parandamine', 'Püsiv tulemus', 'Mitteinvasiivne'],
      sessions: '2-4 seanssi'
    },
    {
      slug: 'hifu-ultraheli-lifting',
      name: 'HIFU Ultraheli Lifting',
      description: 'Kõrge intensiivsusega fokuseeritud ultraheli sügavaks naha tõstmiseks ja pinguldamiseks.',
      price: 199,
      duration: '60-90 min',
      image: 'images/gallery/4.jpg',
      benefits: ['Sügav lifting', 'Pikaajaline tulemus', 'Naha pinguldamine', 'Kollageeni tootmine'],
      sessions: '1-2 seanssi',
      minAge: 35
    },
    {
      slug: 'lpg-naohooldus',
      name: 'LPG Näohooldus',
      description: 'LPG tehnoloogia näole - suurendab vereringet, parandab nahatoonust ja vähendab turset.',
      price: 69,
      duration: '30-45 min',
      image: 'images/gallery/5.jpg',
      benefits: ['Naha toonuse parandamine', 'Turse vähendamine', 'Vereringe parandamine', 'Näo värskendamine'],
      sessions: '5-8 seanssi'
    },
    {
      slug: 'hammaste-valgendamine',
      name: 'Hammaste Valgendamine',
      description: 'Professionaalne hammaste valgendamine LED-valguse ja spetsiaalse geeli abil.',
      price: 99,
      duration: '60 min',
      image: 'images/gallery/6.jpg',
      benefits: ['Heledamad hambad', 'Kiire tulemus', 'Ohutu protseduur', 'Pikaajaline efekt'],
      sessions: '1 seanss'
    }
  ],

  // ============ HOOLDUSTE PAKETID ============
  paketid: [
    // VÄIKESED PAKETID
    {
      slug: 'lpg-massaaz-5x',
      name: 'LPG Massaaž 5x',
      description: 'Viie LPG massaaži pakett tselluliidi ja kehakontuuri parandamiseks.',
      price: 149,
      regularPrice: 395,
      duration: '3-4 nädalat',
      image: 'images/treatments/lpg-massage.jpg',
      includes: ['5x LPG massaaž', 'Konsultatsioon', 'Individuaalne plaan'],
      category: 'small'
    },
    {
      slug: 'topeltmoju',
      name: 'Topeltmõju 5x LPG + 5x ReShape',
      description: 'Kombineeritud pakett maksimaalse tulemuse saavutamiseks - LPG ja ReShape teraapia koos.',
      price: 249,
      regularPrice: 560,
      duration: '5-6 nädalat',
      image: 'images/treatments/hero-model-1.jpg',
      includes: ['5x LPG massaaž', '5x ReShape teraapia', 'Konsultatsioon'],
      category: 'small'
    },
    {
      slug: 'cold-lipo-kruo-kombo',
      name: 'Cold Lipo + Krüo Kombo',
      description: 'Kahe võimsa rasvapõletustehnoloogia kombinatsioon kiireks tulemuseks.',
      price: 199,
      regularPrice: 356,
      duration: '4-6 nädalat',
      image: 'images/treatments/cryolipolysis.jpg',
      includes: ['2x Cold Lipo Laser', '2x Krüolipolüüs', 'Konsultatsioon'],
      category: 'small'
    },

    // KESKMISED PAKETID
    {
      slug: 'lpg-massaaz-10x',
      name: 'LPG Massaaž 10x',
      description: 'Kümne LPG massaaži pakett tugevamate tulemuste saavutamiseks.',
      price: 299,
      regularPrice: 790,
      duration: '5-6 nädalat',
      image: 'images/treatments/lpg-massage.jpg',
      includes: ['10x LPG massaaž', 'Konsultatsioon', 'Toitumissoovitused'],
      category: 'medium'
    },
    {
      slug: 'talvekombo',
      name: 'Talvekombo',
      description: 'Täielik kehahoolduspakett talveks - LPG, krüolipolüüs ja ReShape teraapia.',
      price: 399,
      regularPrice: 725,
      duration: '6-8 nädalat',
      image: 'images/packages/superhooldus.jpg',
      includes: ['5x LPG massaaž', '2x Krüolipolüüs', '8x ReShape teraapia'],
      category: 'medium'
    },
    {
      slug: 'best-body-combo',
      name: 'Best Body Combo',
      description: 'Parim kehakontuuri pakett - mitme tehnoloogia kombinatsioon ideaalse tulemuse saavutamiseks.',
      price: 349,
      regularPrice: 630,
      duration: '6-8 nädalat',
      image: 'images/treatments/hero-model-2.jpg',
      includes: ['4x LPG massaaž', '2x Krüolipolüüs', '6x ReShape teraapia'],
      category: 'medium'
    },
    {
      slug: 'kiirsalenemine',
      name: 'Kiirsalenemine',
      description: 'Intensiivne pakett kiireks kaalulanguseks ja kehakontuuri parandamiseks.',
      price: 359,
      regularPrice: 700,
      duration: '6-8 nädalat',
      image: 'images/treatments/hero-model-3.jpg',
      includes: ['Cold Lipo Laser', 'Kavitatsioon', 'Krüolipolüüs', 'LPG massaaž'],
      category: 'medium'
    },

    // NÄOHOOLDUSE PAKETID
    {
      slug: 'naohooldus-pakett',
      name: '5x LPG Näohooldus + 5x ReShape Näole',
      description: 'Kompleksne näohoolduspakett naha noorendamiseks ja kontuuri parandamiseks.',
      price: 349,
      regularPrice: 510,
      duration: '5-6 nädalat',
      image: 'images/gallery/1.jpg',
      includes: ['5x LPG näohooldus', '5x ReShape näole', 'Konsultatsioon'],
      category: 'medium'
    },
    {
      slug: 'taiuslik-naokontuuri',
      name: 'Täiuslik Näokontuurimine',
      description: 'Premium pakett näokontuuride modelleerimiseks ja naha pinguldamiseks.',
      price: 299,
      regularPrice: 475,
      duration: '4-6 nädalat',
      image: 'images/gallery/2.jpg',
      includes: ['4x RF Lifting', '2x Krüolipolüüs näole', 'Konsultatsioon'],
      category: 'medium'
    },

    // SUURED PAKETID
    {
      slug: 'mega40',
      name: 'MEGA40 Kehahoolduspakett',
      description: 'Meie kõige populaarsem pakett - 40 protseduuri uskumatult soodsa hinnaga! Vali ise hooldused vastavalt oma vajadustele.',
      price: 525,
      regularPrice: 1800,
      duration: '3-4 kuud',
      image: 'images/packages/mega40.jpg',
      includes: ['2x Krüolipolüüs', '10x LPG massaaž', '2x ReShape teraapia', '26x vabalt valitav hooldus'],
      category: 'large',
      highlight: true
    },
    {
      slug: 'rasvapoletuse-superpakett',
      name: 'Rasvapõletuse Superpakett',
      description: 'Maksimaalne rasvapõletus mitme tehnoloogia kombinatsiooniga.',
      price: 599,
      regularPrice: 1250,
      duration: '2-3 kuud',
      image: 'images/treatments/cryolipolysis.jpg',
      includes: ['5x Krüolipolüüs', '10x LPG massaaž', '5x Cold Lipo Laser', '5x Kavitatsioon'],
      category: 'large'
    },
    {
      slug: 'kolmetunnine-superhooldus',
      name: 'Kolmetunnine Superhooldus',
      description: 'Intensiivne kolmetunnine hooldus, mis kombineerib mitut tehnoloogiat ühes seanssis.',
      price: 199,
      regularPrice: 350,
      duration: '3 tundi',
      image: 'images/packages/superhooldus.jpg',
      includes: ['Krüolipolüüs', 'LPG massaaž', 'ReShape teraapia', 'Cold Lipo Laser'],
      category: 'large'
    }
  ]
};

// Ekspordi andmed (kasutatakse HTML-is)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = treatments;
}
