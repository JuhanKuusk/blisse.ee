import { Link } from "react-router-dom";
import { ProductImageUploader } from "@/components/ProductImageUploader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Heart, 
  Zap, 
  Shield, 
  Award, 
  Timer,
  Check,
  ChevronRight,
  Sparkles,
  Star,
  HelpCircle,
  ChevronDown,
  Play,
  Image,
  ChevronLeft,
  Package
} from "lucide-react";
import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import cavi-face images
import caviMainImage from "@/assets/cavi-face/cavi-face-main.jpg";
import caviDetail6 from "@/assets/cavi-face/cavi-face-detail-6.jpg";
import caviDetail7 from "@/assets/cavi-face/cavi-face-detail-7.jpg";
import caviDetail8 from "@/assets/cavi-face/cavi-face-detail-8.jpg";
import caviDetail9 from "@/assets/cavi-face/cavi-face-detail-9.jpg";

// Import reshape-body images
import reshapeBodyMain from "@/assets/reshape-body/reshape-body-main.jpg";
import reshapeBodyDetail1 from "@/assets/reshape-body/reshape-body-detail-1.jpg";
import reshapeBodyDetail2 from "@/assets/reshape-body/reshape-body-detail-2.jpg";
import reshapeBodyDetail3 from "@/assets/reshape-body/reshape-body-detail-3.jpg";
import reshapeBodyDetail4 from "@/assets/reshape-body/reshape-body-detail-4.jpg";
import reshapeBodyDetail5 from "@/assets/reshape-body/reshape-body-detail-5.jpg";
import reshapeBodyDetail6 from "@/assets/reshape-body/reshape-body-detail-6.jpg";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  regular_price: number | null;
  sale_price: number | null;
  image_url: string | null;
  categories: string[] | null;
  sku: string | null;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ProductDetailInfo {
  title: string;
  subtitle?: string;
  benefits: string[];
  howItWorks?: string;
  includes?: string[];
  usage?: { title: string; description: string }[];
  specifications?: { label: string; value: string }[];
  videoUrl?: string;
  galleryImages?: string[];
}

// ReShape product content (excluding infrared mats)
const getReShapeProductInfo = (productName: string): ProductDetailInfo | null => {
  const nameLower = productName.toLowerCase();
  
  // TRE Vibrations - Vibrotreening
  if (nameLower.includes('tre') && nameLower.includes('vibra')) {
    return {
      title: "Vibrotreening TRE Vibrations",
      subtitle: "Vibrotreeningseade, mis imiteerib inimese jooksmisel tekkivat vibratsiooni ja lihaste kontraktsioone",
      benefits: [
        "Parandab lihastoonust",
        "Vähendab tselluliiti",
        "Trimmib nahka",
        "Intensiivne tselluliidivastane toime",
        "Taastab ja modelleerib figuuri",
        "Parandab naha jumet ja toonust",
        "Parandab rühti",
        "Kiirendab ainevahetust",
        "Stimuleerib toksiinide väljutamist kehast",
        "Ennetab osteoporoosi teket",
        "Ennetab veenisüsteemi puudulikkuse teket",
        "Kiirendab traumade järgset taastumist",
        "Vähendab stressi ja depressiooni",
        "Lisab elujõudu ja heaolu tunnet"
      ],
      howItWorks: "Vibrotreening põhineb horisontaalselt liikuval vibratsioonil, mis imiteerib inimese kõndimisel ja jooksmisel tekkivat liikumist ja stimuleerib kõiki kehakudesid. Tundub nagu tuhanded mikrorullikud masseeriks keha jalgadest kaelani. Hoolduse ajal on kaasa haaratud enamus lihasgruppe, mis pingutuvad ja lõõgastuvad 15-30 korda sekundis, ka need, mida tavatreening ei haara. Treeningujärgselt ei teki lihastesse piimhapet, seega pole vaja karta järgmisel päeval lihasvalu.",
      includes: [
        "TRE Vibrations vibratsiooniseade",
        "Tasuta CelluCup vaakummassaaži seade kingituseks",
        "Kasutusjuhend",
        "Garantii"
      ],
      usage: [
        { title: "10 minutit päevas", description: "Kasuta päevas 10 minutit ja tunne kuidas keha muutub ja elukvaliteet paraneb." },
        { title: "Võrreldav treeninguga", description: "10 minutit vibrotreeningut annab lihaskonnale sama koormuse kui 1 tund kõndi väljas." }
      ]
    };
  }
  
  // ReShape Transion HomePro - EMS seade
  if (nameLower.includes('transion') || (nameLower.includes('transition') && nameLower.includes('home'))) {
    return {
      title: "ReShape Transion HomePro",
      subtitle: "21. sajandi meetod kõhnumiseks – langetage kaalu ja treenige lihaseid treeningsaali minemata",
      benefits: [
        "1000 kõhulihase kokkutõmmet tunnis",
        "Infrapunasoojendusega elektropadjakesed",
        "Üliefektiivne treening süvalihastest",
        "Silmnähtavad tulemused juba pärast esimesi kasutuskordi",
        "45 minutit = 3 tundi intensiivset jõusaalitreeningut",
        "Vormib lihaseid ja põletab kaloreid",
        "Vähendab paistetust ja tugevdab nõrku lihaseid",
        "Sobib nii meestele kui naistele",
        "Tugevamad impulsid kui eelmistel mudelitel",
        "Efektiivsemad programmid maksimaalse tulemuse saavutamiseks",
        "Kompaktne disain koduseks kasutamiseks",
        "Teaduslikult tõestatud – kasutusel NASA teadlaste poolt"
      ],
      howItWorks: "ReShape Transion HomePro kasutab EMS (elektrilise lihasstimulatsioon) tehnoloogiat, mis tekitab kontrollitud elektriliste impulsside abil lihaste kokkutõmbumisi. Erinevalt tavalisest treeningust, kus aju saadab signaale lihastele, suudab Transion toota ühtlaseid ja kõrgekvaliteedilisi impulsse otse lihasgruppidesse. See võimaldab treenida ka süvalihaseid, mida tavatreeninguga on raske kätte saada. Tehnoloogia suudab aktiveerida kuni 100% lihaskiududest, samas kui tavatreening aktiveerib vaid 30-40%. Seade on varustatud infrapunasoojendusega padjakestega, mis soodustavad vereringet ja kiirendavad tulemuste saavutamist.",
      includes: [
        "ReShape Transion HomePro põhiseade",
        "10 infrapunasoojendusega elektropadjakest",
        "10 erimõõdus sidet padjakeste kinnitamiseks",
        "Toitejuhe ja adapter",
        "Eestikeelne kasutusjuhend",
        "Tasuta koolitus Tallinna kesklinnas asuvas salongis",
        "ISO 13485 ja CE sertifikaadid",
        "2-aastane garantii"
      ],
      usage: [
        { title: "Enne protseduuri", description: "Joo vähemalt 0,5 liitrit vett enne ja pärast iga protseduuri. See aitab kehal toksiine väljutada." },
        { title: "Ettevalmistamine", description: "Kinnita kummist padjakesed ihule probleemsetesse piirkondadesse. Veendu, et padjakesed on korralikult kinnitatud." },
        { title: "Protseduuri ajal", description: "Vali sobiv programm ja intensiivsus. Saad nautida protseduuri lugedes, vaadates televiisorit või lihtsalt lõõgastudes." },
        { title: "Soovitav sagedus", description: "Parimate tulemuste saavutamiseks kasuta 2-3 korda nädalas, seansi pikkus 30-45 minutit. Maksimaalselt 1 tund päevas." },
        { title: "Tulemused", description: "Esimesed tulemused on nähtavad juba pärast 4-6 seanssi. Püsivate tulemuste saavutamiseks soovitame 8-12 nädala kuuri." }
      ],
      specifications: [
        { label: "Tehnoloogia", value: "EMS (Elektriline lihasstimulatsioon) + Infrapuna" },
        { label: "Kanalite arv", value: "10 kanalit" },
        { label: "Padjakeste arv", value: "10 infrapunasoojendusega padjakest" },
        { label: "Programmide arv", value: "Mitu eelprogrammeeritud programmi" },
        { label: "Impulsi tüüp", value: "Kõrge kvaliteediga ühtlased impulsid" },
        { label: "Infrapunasoojendus", value: "Jah, integreeritud padjakestesse" },
        { label: "Seansi pikkus", value: "30-60 minutit (soovitatav 45 min)" },
        { label: "Kasutussagedus", value: "2-3 korda nädalas" },
        { label: "Toide", value: "Vahelduvvool 220V" },
        { label: "Sertifikaadid", value: "ISO 13485, CE" },
        { label: "Garantii", value: "2 aastat" },
        { label: "Päritolumaa", value: "Euroopa Liit" }
      ]
    };
  }
  
  // ReShape Cavi + Face - 40K kavitatsioon + RF näole ja kehale
  if (nameLower.includes('cavi') && nameLower.includes('face')) {
    return {
      title: "ReShape Cavi + Face",
      subtitle: "3-in-1 professionaalne kehavormi- ja näohooldusseade – kavitatsioon, RF ja punane valgusteraapia",
      benefits: [
        "40K ultraheli kavitatsioon rasvarakkude lõhustamiseks",
        "RF raadiolaine tehnoloogia naha pinguldamiseks",
        "Punane valgusteraapia naha noorendamiseks",
        "Sobib nii näole kui kehale",
        "Vähendab tselluliiti ja rasvaladestusi",
        "Parandab naha elastsust ja toonust",
        "Stimuleerib kollageeni ja elastiini tootmist",
        "Tugevdab ja pinguldab lõtvunud nahka",
        "Silub peeneid jooni ja kortsukesi",
        "Vähendab paistetust ja parandab lümfiringet",
        "Professionaalne salongi kvaliteet koduseks kasutamiseks",
        "Kompaktne ja mugav disain"
      ],
      howItWorks: "ReShape Cavi + Face kombineerib kolme võimsat tehnoloogiat ühes seadmes. 40K ultraheli kavitatsioon loob madalsageduslikke helilaineid, mis tekitavad rasvarakkudes mikromullikesi – need lahjendavad rasva ja tõrjuvad selle rakkudest välja, kust keha selle loomulikult väljutab. RF (raadiolaine) tehnoloogia kuumutab nahaalust kudet kontrollitult, stimuleerides kollageeni ja elastiini tootmist, mis pinguldab ja trimmib nahka. Punane valgusteraapia (LED) tungib nahakihtidesse, soodustades rakkude regeneratsiooni, parandades vereringet ja andes nahale noorusliku sära.",
      includes: [
        "ReShape Cavi + Face põhiseade",
        "40K kavitatsiooni otsik kehale (100W)",
        "RF otsik näole – tripolaarne (1MHz, 60W)",
        "RF otsik kehale – multipolaarne (1MHz, 100W)",
        "Ultraheligeel",
        "Toitejuhe (220V EU pistik)",
        "Varukaitse",
        "Eestikeelne kasutusjuhend",
        "2-aastane garantii"
      ],
      usage: [
        { title: "Ettevalmistus", description: "Puhasta töödeldav piirkond ja kanna peale ultraheligeel. Eemalda kõik metallesemed ja ehted." },
        { title: "Kavitatsioon (40K)", description: "Kasuta ringikujuliste liigutustega probleemsetel kehapiirkondadel. Tugev ultraheli vibreerib rasvarakke kiirusel 40 000 Hz, lõhustades rasvakude membraani. Liigu aeglaselt lümfisõlmede suunas. 15-20 minutit piirkonna kohta." },
        { title: "RF kehahooldus (4-astmeline)", description: "Multipolaarne RF lahustab rasva, tühjendab lümfi, pinguldab nahka ja suurendab naha elastsust. Suunab rasvarakke väljutama üleliigseid toksiine higistamise, soolte ja lümfiringe kaudu. 10-15 minutit." },
        { title: "RF näohooldus (3-astmeline)", description: "Tripolaarne RF kuumutab dermise kollageenikiude 45-65°C-ni, põhjustades kohest kollageeni kokkutõmbumist. Stimuleerib kollageeni hüperplaasiat, suurendab dermise paksust ja tihedust, eemaldab kortsud ja taastab naha elastsuse. 10-15 minutit." },
        { title: "Tähelepanu", description: "Ära jää ühte kohta liiga kauaks. Väldi kasutamist luude peal. Peale 1 tundi pidevat kasutamist tee 10-15 min paus. Kavitatsiooni ajal võib esineda kerget kõrvahelisemist – see on normaalne." }
      ],
      specifications: [
        { label: "Kavitatsiooni sagedus", value: "40 000 Hz (40K)" },
        { label: "Kavitatsiooni võimsus", value: "100W" },
        { label: "RF näo sagedus", value: "1 MHz (tripolaarne)" },
        { label: "RF näo võimsus", value: "60W" },
        { label: "RF keha sagedus", value: "1 MHz (multipolaarne)" },
        { label: "RF keha võimsus", value: "100W" },
        { label: "Otsikute arv", value: "3 (kavitatsioon + 2x RF)" },
        { label: "Materjal", value: "ABS plastik" },
        { label: "Koguvõimsus", value: "100W" },
        { label: "Toide", value: "AC 110V-220V" },
        { label: "Sobib", value: "Näole ja kehale" },
        { label: "Sertifikaadid", value: "CE" },
        { label: "Garantii", value: "2 aastat" }
      ],
      galleryImages: [
        caviMainImage,
        caviDetail6,
        caviDetail7,
        caviDetail8,
        caviDetail9
      ]
    };
  }
  
  // ReShape Therapy - Koduseade kehale (360 Rolling Percussive Massager)
  if ((nameLower.includes('reshape') && nameLower.includes('kehale')) || 
      (nameLower.includes('therapy') && nameLower.includes('koduseade')) ||
      (nameLower.includes('rolling') && nameLower.includes('massager'))) {
    return {
      title: "ReShape Therapy – Koduseade kehale",
      subtitle: "360° pöörlev löökmassor lihaste lõdvestamiseks ja taastumise kiirendamiseks",
      benefits: [
        "360° pöörlev rullmassaaž sügavaks lihaslõdvestuseks",
        "Löökmassor liigeste ja lihaste piirkonnas",
        "Sobib jalgadele, säärtele, reiele, seljale ja õlgadele",
        "Vähendab lihasjäikust ja pingeid",
        "Kiirendab taastumist pärast treeningut",
        "Parandab vereringet ja lümfivoolu",
        "Leevendab lihaskrampe ja valu",
        "Myofastsiaalne vabastus sidekoe jaoks",
        "Edasi-tagasi pöörlemise režiim",
        "Juhtmevaba ja laetav aku",
        "Ergonoomilised käepidemed",
        "Kompaktne disain koos alusega",
        "Sobib nii sportlastele kui kontoritöötajatele"
      ],
      howItWorks: "ReShape Therapy kehaseade kombineerib 360° pöörlevat rullmassaaži ja löökvibratsioonitehnoloogiat, pakkudes samal ajal nii perkussiivse massaaži kui ka traditsioonilise rullmassoori eeliseid. Seade masseerib lihaseid sügavalt, lõdvestades pingeid ja parandades vereringet. Võimaldab edasi- ja tagasi pöörlemist, mis annab tõhusama massaažiefekti. Spetsiaalsed massaažikerad on ergonoomiliselt paigutatud, et jõuda sügavatesse lihaskihtidesse ilma ebamugavustundeta.",
      includes: [
        "ReShape Therapy pöörlev rullmassor",
        "Laadimisalus",
        "USB-C laadimiskaabel",
        "Eestikeelne kasutusjuhend",
        "2-aastane garantii"
      ],
      usage: [
        { title: "Jalgade massaaž", description: "Aseta seade laadimisalusele ja kasuta jalgu üle rulli edasi-tagasi liigutades. Sobib suurepäraselt pärast pikka päeva jalul seismist." },
        { title: "Säärte ja reite massaaž", description: "Kasuta käsipidemeid ja masseeri säärelihaseid ja reie tagaosa. Ideaalne jooksjatele ja jalgpalluritele." },
        { title: "Selja ja õlgade massaaž", description: "Hoia käepidemetest ja kasuta rulli selja ja õlgade lihasjäikuse leevendamiseks." },
        { title: "Pärast treeningut", description: "Kasuta 10-15 minutit pärast treeningut lihaste taastumise kiirendamiseks ja piimhappe eemaldamiseks." },
        { title: "Igapäevane kasutamine", description: "Sobib kasutamiseks iga päev. Alusta 5-10 minutiga ja suurenda vastavalt vajadusele." }
      ],
      specifications: [
        { label: "Tehnoloogia", value: "360° pöörlev rullmassaaž + löökmassor" },
        { label: "Pöörlemissuund", value: "Edasi ja tagasi" },
        { label: "Materjal", value: "ABS + TPR" },
        { label: "Toide", value: "Laetav aku (USB-C)" },
        { label: "Rulli mõõtmed", value: "480mm x 110mm" },
        { label: "Aluse mõõtmed", value: "360mm x 165mm x 65mm" },
        { label: "Kasutuspiirkonnad", value: "Jalad, sääred, reied, selg, õlad" },
        { label: "Sobib", value: "Sportlased, kontoritöötajad, igapäevaseks kasutamiseks" },
        { label: "Pistik", value: "EU pistik" },
        { label: "Sertifikaadid", value: "CE" },
        { label: "Garantii", value: "2 aastat" }
      ],
      galleryImages: [
        reshapeBodyMain,
        reshapeBodyDetail1,
        reshapeBodyDetail2,
        reshapeBodyDetail3,
        reshapeBodyDetail4,
        reshapeBodyDetail5,
        reshapeBodyDetail6
      ]
    };
  }
  
  // Kavitatsioon PRO
  if (nameLower.includes('kavitat') || nameLower.includes('80khz') || nameLower.includes('80k')) {
    return {
      title: "KAVITATSIOON PRO – 80kHz mittekirurgiline rasvaimu",
      subtitle: "Uue generatsiooni kaalulangetusseade – tugevaim ultraheli sagedus turul",
      benefits: [
        "80 000 Hz ultraheli – efektiivseim kavitatsioon turul",
        "Tugevam kui salongides pakutav",
        "Lõhustab rasvaraku membraani",
        "Koheselt mõõdetavad tulemused",
        "Ümbermõõdud vähenevad esimese korraga",
        "Lihtne ja turvaline kasutada",
        "Vähendab tselluliiti",
        "RF otsikud näole ja kehale",
        "Trimmib nahka"
      ],
      howItWorks: "Rasvaraku membraani purustamine toimub madalsagedusliku ultraheli abil. Rasvkoes tekib ultraheli toimel, mille helilaine võimsus on 80 000 Hz ja rõhk 1,1 kPa, kavitatsiooniefekt – mikromullikeste tekkimise protsess. Mõõtmete suurenemisel lahjendavad need rasva ja tõrjuvad selle adipotsüütidest välja. 90% rasvarakkude lagunemisproduktidest väljutatakse lümfisüsteemi kaudu, ülejäänud 10% absorbeerub vereringes.",
      includes: [
        "Kavitatsioon PRO seade",
        "80 000 kHz otsik rasvarakkude lõhustamiseks",
        "RF otsik näole",
        "RF otsik kehale",
        "Tasuta ultraheligeel",
        "Toitejuhe",
        "Kasutusjuhend",
        "Garantii"
      ],
      usage: [
        { title: "Ettevalmistus", description: "Enne hooldust eemaldage kehalt kõik metallesemed. Protseduuri ajal ei tohi rääkida mobiiltelefoniga." },
        { title: "Kavitatsioon", description: "Kanna probleemsetele piirkondadele ultraheligeeli ja liigu masseerivate liigutustega lümfisõlmede suunas." },
        { title: "Vaakummassaaž", description: "Kavitatsiooni järel tehakse samale piirkonnale vaakummassaaž tulemuse kiirendamiseks." },
        { title: "Sagedus", description: "Kavitatsiooni tehakse 2 korda nädalas. Päevas tohib teha maksimaalselt 1 tund kavitatsiooni." }
      ]
    };
  }
  
  // EMS Treeningpüksid
  if (nameLower.includes('ems') && nameLower.includes('püks')) {
    return {
      title: "EMS Treeningpüksid",
      subtitle: "Teie ideaalne treeningpartner metsajooksul, kodus või kontoris",
      benefits: [
        "Vähendavad tselluliiti",
        "Kiirendavad rasvapõletust ja aitavad kaalu langetada",
        "Suurendavad lihastoonust ja vormivad keha",
        "Kiirendavad taastumist pärast treeningut",
        "Vähendavad lihaspingeid ja parandavad vereringet",
        "Mugavad ja sobivad erinevateks treeninguteks",
        "Lihtne kasutada ja hooldada",
        "Kuus infrapunasoendusega elektriimpulsse edastavat padjakest",
        "Valik 6 programmi vahel"
      ],
      howItWorks: "EMS elektrostimulatsiooniga võitlete edukalt nii tselluliidi kui ka lõtvunud naha vastu. Kuus infrapunasoendusega elektriimpulsse edastavat padjakest saadavad Teie lihasgruppidesse impulsse ja panevad lihased Teie eest tööle. Elektrostimulatsiooni toime on teaduslikult tõestatud ning võetud kasutusele ka NASA teadlaste poolt.",
      includes: [
        "EMS Treeningpüksid",
        "Juhtpult programmide valimiseks",
        "Laadija",
        "Kasutusjuhend"
      ],
      usage: [
        { title: "Mitmekülgne kasutamine", description: "Sobivad jooksmisele, jõusaali või koduseks treeninguteks." },
        { title: "Kerge kaasaskanda", description: "Kerged, venivad ja mahuvad hästi kohvrisse – ideaalne reisile." },
        { title: "Igapäevane kasutamine", description: "Jalutage, ostelge või nautige vaateid samal ajal kui püksid Teie keha eest hoolitsevad." }
      ]
    };
  }
  
  // EMS Treeningvest
  if (nameLower.includes('ems') && nameLower.includes('vest')) {
    return {
      title: "EMS Treeningvest",
      subtitle: "Ülitõhus elektrostimulatsioonil põhinev treeningmeetod kodus, trennis või vabas õhus",
      benefits: [
        "Efektiivne lihastreening 20 minuti jooksul",
        "Kuni 1000 kcal põletamine poole tunniga (Kardio programmiga)",
        "Lihaste ehitamine ja vormistamine",
        "Lõdvestab lihaseid pärast pingelist treeningut",
        "Sobib kasutamiseks kodus, trennis või vabas õhus",
        "Juhitakse telefonirakenduse abil",
        "Saab ise määrata vajalikku koormust",
        "Bluetooth ühendus"
      ],
      howItWorks: "Maailmas ja Eestis populaarsust kogunud elektrostimulatsioonil põhinev treeningmeetod saadab lihastele impulsse, et tekitada kunstlikult lihaste pinguldamine ja lõdevestamine. Koduseadet juhitakse telefonirakenduse abil, mis saadab info läbi Bluetooth'i selga pandava kostüümi vastuvõtjasse ja see omakorda jagab impulsid vastavalt erinevatele lihasgruppidele.",
      includes: [
        "EMS Treeningvest",
        "Bandaažid",
        "Transmitter",
        "EMS rakendus telefonile",
        "Kasutusjuhend",
        "Koolitus"
      ],
      usage: [
        { title: "KARDIO programm", description: "Rahulik, rasvapõletamisele suunatud programm. Kaotate kuni 1000 kcal poole tunniga." },
        { title: "LIHASTREENING programm", description: "Lihaste ehitamiseks – valige erinevate intensiivsuste ja pikkuste vahel." },
        { title: "LÕDVESTUSPROGRAMM", description: "Lõdvestab lihaseid mitmesuguste lõdvestavate kontraktsioonide kaudu pärast pingelist treeningut." }
      ]
    };
  }
  
  // CelluCup
  if (nameLower.includes('cellucup') || nameLower.includes('cellu cup')) {
    return {
      title: "CelluCup",
      subtitle: "Professionaalne vaakummassaaži seade tselluliidi vähendamiseks",
      benefits: [
        "Vähendab tselluliiti",
        "Parandab vereringet",
        "Stimuleerib lümfisüsteemi",
        "Trimmib nahka",
        "Sobib kasutamiseks kogu kehale",
        "Kompaktne ja kerge kaasaskanda",
        "Lihtne kasutada"
      ],
      howItWorks: "CelluCup kasutab vaakumtehnoloogiat, mis tõstab nahaalust kudet ja parandab vereringet. See aitab lõhustada rasvaladestusi ja vähendada tselluliidi ilmnemist, samal ajal stimuleerides lümfisüsteemi.",
      includes: [
        "CelluCup vaakummassaaži seade",
        "Kasutusjuhend"
      ],
      usage: [
        { title: "Kasutamine õliga", description: "Vaakummassaaži tehakse õliga kogu kehale, va rindadele." },
        { title: "Päevane norm", description: "Päevas tohib teha 1 tund hooldust." },
        { title: "Kombineeritud kasutamine", description: "Soovitav kasutada pärast kavitatsiooni või infrapunamati protseduuri." }
      ]
    };
  }
  
  // VacumPro
  if (nameLower.includes('vacumpro') || nameLower.includes('vacum pro')) {
    return {
      title: "VacumPro",
      subtitle: "Kavitatsiooniseade koos vaakummassaažiga – professionaalne lahendus koju",
      benefits: [
        "Kavitatsioon ja vaakummassaaž ühes seadmes",
        "Lõhustab rasvarakke",
        "Vähendab tselluliiti",
        "Parandab naha elastsust",
        "Stimuleerib kollageeni tootmist",
        "Professionaalsed tulemused kodus"
      ],
      howItWorks: "VacumPro kombineerib kavitatsiooni ja vaakummassaaži tehnoloogiaid. Kavitatsioon lõhustab rasvarakke ultraheli abil, vaakummassaaž aitab tõsta nahaalust kudet ja parandada vereringet tulemuste kiirendamiseks.",
      includes: [
        "VacumPro seade",
        "Kavitatsiooni otsik",
        "Vaakummassaaži otsik",
        "Ultraheligeel",
        "Kasutusjuhend",
        "Garantii"
      ]
    };
  }
  
  // Krüolipolüüs
  if (nameLower.includes('krüo') || nameLower.includes('cryo') || nameLower.includes('külm')) {
    return {
      title: "Krüolipolüüs",
      subtitle: "Rasvarakkude külmutamise tehnoloogia koduseks kasutamiseks",
      benefits: [
        "Külmutab ja hävitab rasvarakke",
        "Ei nõua kirurgilist sekkumist",
        "Tulemused nähtavad 2-4 nädala jooksul",
        "Sobib kõhupiirkonnale ja reitel",
        "Ohutu ja efektiivne",
        "Püsivad tulemused"
      ],
      howItWorks: "Krüolipolüüs kasutab kontrollitud jahutamist rasvarakkude hävitamiseks. Külm temperatuur põhjustab rasvarakkude kristalliseerumise ja loomulikku hävitamist, mille keha loomulikult väljutab.",
      includes: [
        "Krüolipolüüsi seade",
        "Külmumisvastased membraanid",
        "Kasutusjuhend",
        "Garantii"
      ]
    };
  }
  
  return null;
};

// Product-specific FAQ data based on device type
const getProductFAQ = (productName: string, productId: number): FAQItem[] => {
  const nameLower = productName.toLowerCase();
  
  // TRE Vibrations
  if (nameLower.includes('tre') && nameLower.includes('vibra')) {
    return [
      {
        question: "Kuidas Tre Vibrations mulle kasulik on?",
        answer: "Vibrotreening aktiveerib rohkem lihaskiude kui traditsioonilised harjutused, aidates suurendada lihasjõudu ja toonust. See parandab tasakaalu ja koordinatsiooni, on vähem koormav liigeste jaoks, stimuleerib vereringet ja aitab kaasa rasvade põletamisele."
      },
      {
        question: "Kui palju aega päevas peaksin kasutama?",
        answer: "Kasuta päevas 10 minutit ja tunne kuidas keha muutub ja elukvaliteet paraneb. 10 minutit vibrotreeningut annab lihaskonnale sama koormuse kui 1 tund kõndi väljas."
      },
      {
        question: "Kas vibrotreening tekitab lihasvalu?",
        answer: "Treeningujärgselt ei teki lihastesse piimhapet, seega pole vaja karta järgmisel päeval lihasvalu. Vibratsioon stimuleerib lihaseid õrnalt ja efektiivselt."
      },
      {
        question: "Millised on vastunäidustused?",
        answer: "Ei soovitata kasutamist raseduse ajal, südamestimulaatori kandjatele, ägedate põletike korral või vahetult pärast operatsioone. Kahtluse korral konsulteerige arstiga."
      },
      {
        question: "Mis on komplektis kaasas?",
        answer: "Seadmega kingituseks kaasa tasuta CelluCup vaakummassaaži seade. Soovitav teha enne ja pärast CelluCup vaakummassaaži protseduuri ning saavutad maksimaalse tulemuse."
      }
    ];
  }
  
  // ReShape Transion HomePro
  if (nameLower.includes('transion') || (nameLower.includes('transition') && nameLower.includes('home'))) {
    return [
      {
        question: "Mis on ReShape Transion HomePro?",
        answer: "ReShape Transion HomePro on koduseks kasutamiseks mõeldud professionaalne EMS (elektriline lihasstimulatsioon) seade. See on 21. sajandi meetod kõhnumiseks ja lihaste treenimiseks, mis sobib ideaalselt kiire elutempoga inimestele. Tehnoloogia on teaduslikult tõestatud ja kasutusel ka NASA teadlaste poolt astronautide lihaste vormisoleku säilitamiseks."
      },
      {
        question: "Kuidas EMS treening töötab?",
        answer: "EMS (elektriline lihasstimulatsioon) saadab kontrollitud elektrilisi impulsse otse lihastesse, põhjustades nende kokkutõmbumist. Erinevalt tavalisest treeningust aktiveerib EMS kuni 100% lihaskiududest, samas kui tavatreening aktiveerib vaid 30-40%. Infrapunasoojendusega padjakesed soodustavad vereringet ja kiirendavad tulemuste saavutamist."
      },
      {
        question: "Kas ReShape Transion HomePro kasutamine on ohutu?",
        answer: "Jah, EMS tehnoloogia on väljatöötatud arstide ning teadlaste poolt üle 30 aasta tagasi ning on laialdaselt kasutatav haiglates, füsioteraapiakliinikutes ning taastusravis. ReShape Transion HomePro on ISO 13485 ja CE sertifitseeritud, mis tagab seadme ohutuse ja kvaliteedi."
      },
      {
        question: "Kui kiiresti tulemused tulevad?",
        answer: "Esimesed tulemused on tunnetatavad juba pärast esimest protseduuri – lihased on toonuses ja keha tunneb end energilisemana. Nähtavad tulemused ilmnevad tavaliselt 4-6 seansi järel. Püsivate tulemuste saavutamiseks soovitame 8-12 nädala kuuri, kasutades seadet 2-3 korda nädalas."
      },
      {
        question: "Kui kaua ja kui tihti peaksin seadet kasutama?",
        answer: "Optimaalsete tulemuste saavutamiseks soovitame kasutada seadet 2-3 korda nädalas, seansi pikkusega 30-45 minutit. Maksimaalne päevane kasutusaeg on 1 tund. 45 minutit EMS treeningut võrdub umbes 3 tunni intensiivse jõusaalitreeninguga. Joo alati enne ja pärast protseduuri vähemalt 0,5 liitrit vett."
      },
      {
        question: "Kas seade sobib nii meestele kui naistele?",
        answer: "Jah, ReShape Transion HomePro on loodud kasutamiseks nii meestele kui naistele. Kuigi probleemsed piirkonnad võivad olla erinevad (naised keskenduvad sageli reitel ja kõhule, mehed rinnakorvi ja käsivartele), on tulemused võrdselt efektiivsed mõlemale soole."
      },
      {
        question: "Millised on vastunäidustused?",
        answer: "ReShape Transion HomePro kasutamine on vastunäidustatud järgmistel juhtudel: rasedus, epilepsia, südamehaigused, südamestimulaatori olemasolu, metallist implantaadid töödeldavas piirkonnas, äge tromboos või flebiit, kasvajad, nahakahjustused töödeldavas piirkonnas. Kahtluse korral konsulteeri arstiga."
      },
      {
        question: "Mida sisaldab komplekt?",
        answer: "Komplektis on: ReShape Transion HomePro põhiseade, 10 infrapunasoojendusega elektropadjakest, 10 erimõõdus sidet padjakeste kinnitamiseks, toitejuhe ja adapter, eestikeelne kasutusjuhend, tasuta koolitus Tallinna salongis ning 2-aastane garantii. Seade on ISO 13485 ja CE sertifitseeritud."
      },
      {
        question: "Kas saan kasutada seadet samal ajal muude tegevustega?",
        answer: "Jah! See ongi üks Transion HomePro suuremaid eeliseid. Saate protseduuri ajal lugeda raamatut, vaadata televiisorit, töötada arvutis või lihtsalt lõõgastuda. Seade töötab vaikselt ja ei sega teisi tegevusi."
      },
      {
        question: "Milline on garantii ja tugi?",
        answer: "ReShape Transion HomePro'le kehtib 2-aastane garantii. Lisaks pakume tasuta koolitust meie Tallinna kesklinnas asuvas salongis, kus õpetame seadme kasutamist ja anname personaalsed soovitused. Klienditugi on alati valmis abistama küsimuste korral."
      }
    ];
  }
  
  // ReShape Cavi + Face
  if (nameLower.includes('cavi') && nameLower.includes('face')) {
    return [
      {
        question: "Mis on ReShape Cavi + Face?",
        answer: "ReShape Cavi + Face on 3-in-1 professionaalne kehavormi- ja näohooldusseade, mis kombineerib 40K ultraheli kavitatsiooni, RF raadiolaine tehnoloogiat ja punast valgusteraapiat. See võimaldab teha professionaalseid salongihooldusi mugavalt kodus."
      },
      {
        question: "Kuidas 40K kavitatsioon töötab?",
        answer: "40K (40 000 Hz) ultraheli kavitatsioon loob madalsageduslikke helilaineid, mis tekitavad rasvarakkudes mikromullikesi. Need mullikesed lahjendavad rasva ja tõrjuvad selle rakkudest välja. Keha väljutab lagundatud rasva loomulikult lümfisüsteemi kaudu."
      },
      {
        question: "Mida teeb RF (raadiolaine) tehnoloogia?",
        answer: "RF tehnoloogia kuumutab nahaalust kudet kontrollitult 40-45°C temperatuurini. See stimuleerib kollageeni ja elastiini tootmist, mis pinguldab ja trimmib nahka. Tulemuseks on noorem, elastsem ja siledama välimusega nahk."
      },
      {
        question: "Kas seade sobib näole?",
        answer: "Jah! Seadmel on eraldi tripolaarne RF otsik näohoolduseks. See aitab siluda peeneid jooni ja kortsukesi, pinguldada lõtvunud nahka näol ja kaelal ning parandada naha üldist toonust ja tekstuuri."
      },
      {
        question: "Kui sageli tohib seadet kasutada?",
        answer: "Kehahooldust (kavitatsioon + RF) soovitame teha 2-3 korda nädalas. Näohooldust 1-2 korda nädalas. Sama piirkonda ei tohi töödelda üle 20-30 minuti korraga. Jäta hoolduste vahele vähemalt 48 tundi."
      },
      {
        question: "Millal on näha tulemusi?",
        answer: "Esimesed tulemused võivad olla nähtavad juba pärast esimesi hooldusi – nahk tundub siledamana ja pingutatumana. Püsivad tulemused rasva vähendamisel ja naha pinguldamisel ilmnevad tavaliselt 4-6 nädala jooksul regulaarsel kasutamisel."
      },
      {
        question: "Millised on vastunäidustused?",
        answer: "Seadet ei tohi kasutada: raseduse ja imetamise ajal, südamestimulaatori või metallimplantaatide olemasolul töödeldavas piirkonnas, aktiivse vähi korral, ägedate nahaprobleemide korral, epilepsia korral. Kahtluse korral konsulteerige arstiga."
      },
      {
        question: "Mida sisaldab komplekt?",
        answer: "Komplektis on: põhiseade, 40K kavitatsiooni otsik kehale, RF otsik näole (tripolaarne), RF otsik kehale (multipolaarne), ultraheligeel, toitejuhe (220V EU pistik), eestikeelne kasutusjuhend ja 2-aastane garantii."
      }
    ];
  }
  
  // Kavitatsioon
  if (nameLower.includes('kavitat') || nameLower.includes('80khz') || nameLower.includes('80k')) {
    return [
      {
        question: "Kuidas 80kHz kavitatsioon töötab?",
        answer: "80 000 Hz ultraheli tekitab rasvkoes kavitatsiooniefekti – mikromullikeste tekkimise protsessi. Need mullikesed lahjendavad rasva ja lõhuvad rasvaraku membraani. 90% rasvarakkude lagunemisproduktidest väljutatakse lümfisüsteemi kaudu, ülejäänud 10% absorbeerub vereringes."
      },
      {
        question: "Kui sageli tohib kasutada?",
        answer: "Kavitatsiooni tehakse 2 korda nädalas, vaakummassaaži samuti. Päevas tohib teha maksimaalselt 1 tund kavitatsiooni."
      },
      {
        question: "Millised on vastunäidustused?",
        answer: "Ei tohi kasutada raseduse ajal ega imetades. Vastunäidustused: fibromüalgia, pahaloomulised kasvajad, II astme diabeet, neeruprobleemid, metallproteesid lokaalselt, epilepsia, tõsised maksaprobleemid."
      },
      {
        question: "Millal on näha tulemusi?",
        answer: "Kavitatsioon lõhub 1 tunniga pea kilo jagu rasvarakke, vähendades koos vaakummassaažiga 2-5 cm ühest piirkonnast. Tulemused on koheselt mõõdetavad!"
      },
      {
        question: "Mis on komplektis?",
        answer: "Kavitatsioon PRO seade, 80 000 kHz otsik rasvarakkude lõhustamiseks, RF otsik näole, RF otsik kehale, tasuta ultraheligeel, toitejuhe, kasutusjuhend ja garantii."
      }
    ];
  }
  
  // EMS Treeningpüksid
  if (nameLower.includes('ems') && nameLower.includes('püks')) {
    return [
      {
        question: "Kuidas EMS Treeningpüksid töötavad?",
        answer: "Kuus infrapunasoendusega elektriimpulsse edastavat padjakest saadavad lihasgruppidesse impulsse ja panevad lihased tööle. Elektrostimulatsiooni toime on teaduslikult tõestatud ning võetud kasutusele ka NASA teadlaste poolt."
      },
      {
        question: "Millised on EMS Treeningpükste eelised?",
        answer: "EMS-tehnoloogiaga näed treeningtulemusi kiiremini. Vähendavad tselluliiti, kiirendavad rasvapõletust, suurendavad lihastoonust, kiirendavad taastumist ja leevendavad lihaspingeid."
      },
      {
        question: "Kuhu saab pükse kasutada?",
        answer: "Sobivad jooksmisele, jõusaali või koduseks treeninguteks. Kerged ja mahuvad hästi kohvrisse – ideaalne reisile kaasavõtmiseks. Võite neid kasutada igasugusteks tegevusteks."
      },
      {
        question: "Kas on olemas meditsiiniline uuring?",
        answer: "Jah, EMS Treeningpükste uuring viidi läbi 41 üliõpilase peal Lõuna Koreas. Uuring tõestas elektrilise lihasstimulatsioooni mõju süvalihaste aktiveerimisele ja füüsilisele jõudlusele."
      }
    ];
  }
  
  // EMS Treeningvest
  if (nameLower.includes('ems') && nameLower.includes('vest')) {
    return [
      {
        question: "Kuidas EMS Treeningvest töötab?",
        answer: "Elektrostimulatsioonil põhinev treeningmeetod saadab lihastele impulsse, et tekitada kunstlikult lihaste pinguldamine ja lõdevestamine. Seadet juhitakse telefonirakenduse abil läbi Bluetooth'i."
      },
      {
        question: "Millised programmid on saadaval?",
        answer: "Kolm programmi: KARDIO (rasvapõletamine, kuni 1000 kcal poole tunniga), LIHASTREENING (lihaste ehitamiseks) ja LÕDVESTUSPROGRAMM (lihaste hellitamiseks pärast treeningut)."
      },
      {
        question: "Kui efektiivne on EMS treening?",
        answer: "20 minutit EMS treeningut vastab ligikaudu 90 minutile tavapärasele treeningule. Kardio programmiga kaotate kuni 1000 kcal poole tunniga."
      },
      {
        question: "Mis on komplektis?",
        answer: "EMS Treeningvest, bandaažid, transmitter, EMS rakendus telefonile, kasutusjuhend ja koolitus."
      }
    ];
  }
  
  // Default FAQ for other devices
  return [
    {
      question: "Kas seadmel on garantii?",
      answer: "Jah, kõikidele meie kehahooldusseadmetele kehtib 24-kuuline tootjagarantii. Garantii katab tootmisdefektid ja tehnilised rikked normaalse kasutuse korral."
    },
    {
      question: "Kuidas seadet hooldada?",
      answer: "Pühkige seadet pärast iga kasutamist puhta, niiske lapiga. Hoidke seadet kuivas ja jahedas kohas. Ärge kasutage agressiivseid puhastusvahendeid. Järgige kasutusjuhendit seadme pikaealisuse tagamiseks."
    },
    {
      question: "Kas seade sobib koduseks kasutamiseks?",
      answer: "Jah, see seade on loodud spetsiaalselt koduseks kasutamiseks. See on kompaktne, lihtne kasutada ja ohutu. Kasutusjuhend on lisatud ning meie klienditugi on alati valmis aitama."
    },
    {
      question: "Kui kiiresti ma tarne kätte saan?",
      answer: "Tavapärane tarneaeg on 2-3 tööpäeva üle Eesti. Tellimused töödeldakse 24 tunni jooksul ja saatmisel saadetakse jälgimislink e-postile."
    },
    {
      question: "Kas saan toote tagastada kui see ei sobi?",
      answer: "Jah, pakume 14-päevast tagastusõigust. Kui toode ei vasta teie ootustele, saate selle tagastada originaalpakendis ja kasutamata kujul täieliku raha tagasimakse saamiseks."
    }
  ];
};

// Gallery Section with Lightbox
const GallerySection = ({ images }: { images: string[] }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  return (
    <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
      <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
        <div className="w-10 h-10 rounded-xl bg-beauty-teal flex items-center justify-center">
          <Image className="w-5 h-5 text-white" />
        </div>
        Galerii
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <div 
            key={i} 
            className="relative aspect-square rounded-xl overflow-hidden bg-muted border border-border group cursor-pointer"
            onClick={() => openLightbox(i)}
          >
            <img 
              src={img} 
              alt={`Galerii pilt ${i + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Kliki suuremaks
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[95vh] p-0 bg-background/98 border-border backdrop-blur-xl">
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors"
          >
            <span className="text-foreground text-xl font-light">×</span>
          </button>
          <div className="relative flex items-center justify-center min-h-[60vh]">
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 md:left-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </button>

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8">
              <img 
                src={images[currentImageIndex]} 
                alt={`Galerii pilt ${currentImageIndex + 1}`} 
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-muted hover:bg-accent border border-border flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-muted px-4 py-2 rounded-full border border-border">
              <span className="text-foreground text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 p-4 overflow-x-auto justify-center bg-muted/50 border-t border-border">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentImageIndex 
                    ? 'border-beauty-teal ring-2 ring-beauty-teal/30' 
                    : 'border-border hover:border-beauty-peach'
                }`}
              >
                <img 
                  src={img} 
                  alt={`Pisipilt ${i + 1}`} 
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProductDeviceTemplateProps {
  product: Product;
}

const ProductDeviceTemplate = ({ product }: ProductDeviceTemplateProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentPrice = product.sale_price && product.regular_price && product.sale_price < product.regular_price 
    ? product.sale_price 
    : (product.price || product.regular_price || 0);
  
  const isSale = !!(product.sale_price && product.regular_price && product.sale_price < product.regular_price);
  const discountPercent = isSale && product.regular_price 
    ? Math.round((1 - currentPrice / product.regular_price) * 100) 
    : 0;

  // Parse description for features
  const parseFeatures = (desc: string | null) => {
    if (!desc) return [];
    const cleanText = desc
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/✔/g, '•');
    
    const features: string[] = [];
    const lines = cleanText.split(/\n|<br\s*\/?>/gi);
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('✓') || trimmed.startsWith('-')) {
        features.push(trimmed.replace(/^[•✓-]\s*/, ''));
      }
    });
    return features.slice(0, 6);
  };

  const features = parseFeatures(product.description);
  const faqItems = getProductFAQ(product.name, product.id);
  const reshapeInfo = getReShapeProductInfo(product.name);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-beauty-teal/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-beauty-pink/5 rounded-full blur-3xl" />
      </div>

      <main className="relative container px-4 py-8">
        {/* Back button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Tagasi</span>
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Product Image */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-beauty-teal/10 via-beauty-pink/10 to-beauty-teal/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Main image container */}
            <div className="relative bg-card rounded-3xl p-8 border border-border shadow-sm overflow-hidden">
              {/* Decorative lines */}
              <div className="absolute top-0 left-1/2 w-px h-20 bg-gradient-to-b from-beauty-teal/30 to-transparent" />
              <div className="absolute bottom-0 left-1/2 w-px h-20 bg-gradient-to-t from-beauty-pink/30 to-transparent" />
              
              <img
                src={product.image_url || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-auto max-h-[500px] object-contain relative z-10 drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              />

              {/* Sale badge */}
              {isSale && (
                <div className="absolute top-6 left-6 z-20">
                  <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-md">
                    <Zap className="w-4 h-4" />
                    -{discountPercent}%
                  </div>
                </div>
              )}

              {/* Tech badge */}
              <div className="absolute top-6 right-6 z-20">
                <div className="bg-beauty-teal text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3 h-3" />
                  PRO SEADE
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Categories */}
            {product.categories && product.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories.slice(0, 3).map((cat, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-medium text-cyan-400/80 uppercase tracking-wider"
                  >
                    {cat}
                    {i < Math.min(product.categories!.length, 3) - 1 && <span className="mx-2 text-slate-600">•</span>}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-foreground"
              style={{ fontFamily: 'Verdana, sans-serif' }}
            >
              {product.name}
            </h1>

            {/* Price section */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl lg:text-5xl font-bold text-beauty-teal">
                {currentPrice.toFixed(2)}€
              </span>
              {isSale && product.regular_price && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.regular_price.toFixed(2)}€
                </span>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-beauty-teal" />
                <span>2 aastat garantiid</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4 text-beauty-bronze" />
                <span>Professionaalne kvaliteet</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Timer className="w-4 h-4 text-beauty-teal" />
                <span>Kiire tarne 2-3 päeva</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-8">
              <Button 
                className="flex-1 h-14 text-lg font-semibold bg-beauty-teal hover:bg-beauty-teal/90 text-white border-0 shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Lisa ostukorvi
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 border-border bg-card hover:bg-accent"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart 
                  className={`h-6 w-6 transition-colors ${isWishlisted ? 'fill-beauty-rose text-beauty-rose' : 'text-muted-foreground'}`} 
                />
              </Button>
            </div>

            {/* Admin: Update database image (only for ReShape Cavi + Face) */}
            {product.name.toLowerCase().includes('cavi') && product.name.toLowerCase().includes('face') && (
              <div className="mb-8 p-4 bg-muted rounded-xl border border-border">
                <p className="text-sm text-muted-foreground mb-3">Admin: Uuenda toote pilti andmebaasis</p>
                <ProductImageUploader 
                  productId={product.id} 
                  currentImageUrl={product.image_url}
                />
              </div>
            )}

            {features.length > 0 && (
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 text-beauty-teal" />
                  Peamised omadused
                </h3>
                <ul className="space-y-3">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-beauty-teal mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <FeatureCard 
            icon={<Zap className="w-5 h-5" />}
            title="Professionaalne tulemus"
            description="Salongi kvaliteediga tulemused mugavalt kodus"
            colorClass="bg-beauty-teal"
          />
          <FeatureCard 
            icon={<Shield className="w-5 h-5" />}
            title="Ohutu kasutada"
            description="Testitud ja sertifitseeritud seadmed"
            colorClass="bg-beauty-pink"
          />
          <FeatureCard 
            icon={<Star className="w-5 h-5" />}
            title="Klienditugi"
            description="Professionaalne nõustamine"
            colorClass="bg-beauty-bronze"
          />
          <FeatureCard 
            icon={<Package className="w-5 h-5" />}
            title="Kehahoolduseadmed"
            description="Kvaliteetsed koduseadmed"
            colorClass="bg-beauty-rose"
          />
        </div>

        {/* Video Section */}
        {reshapeInfo?.videoUrl && (
          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-beauty-rose flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              Vaata videot
            </h2>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border">
              <iframe
                src={reshapeInfo.videoUrl}
                title="Product video"
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-muted-foreground text-sm mt-4 text-center">
              Vaata, kuidas ReShape Transion HomePro töötab ja milliseid tulemusi saavutada
            </p>
          </div>
        )}

        {/* Gallery Section */}
        {reshapeInfo?.galleryImages && reshapeInfo.galleryImages.length > 0 && (
          <GallerySection images={reshapeInfo.galleryImages} />
        )}

        {/* How it works */}
        {reshapeInfo?.howItWorks && (
          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-beauty-teal flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              Kuidas see töötab?
            </h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {reshapeInfo.howItWorks}
            </p>
          </div>
        )}

        {/* Benefits section */}
        {reshapeInfo?.benefits && reshapeInfo.benefits.length > 0 && (
          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-beauty-teal flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              Eelised ja omadused
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {reshapeInfo.benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="w-6 h-6 rounded-full bg-beauty-teal flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Usage instructions */}
        {reshapeInfo?.usage && reshapeInfo.usage.length > 0 && (
          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-beauty-bronze flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              Kuidas kasutada
            </h2>
            <div className="space-y-4">
              {reshapeInfo.usage.map((step, i) => (
                <div key={i} className="flex gap-4 p-5 bg-muted/50 rounded-xl border border-border">
                  <div className="w-10 h-10 rounded-full bg-beauty-bronze/20 flex items-center justify-center flex-shrink-0 border border-beauty-bronze/30">
                    <span className="text-beauty-bronze font-bold">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{step.title}</h4>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's included */}
        {reshapeInfo?.includes && reshapeInfo.includes.length > 0 && (
          <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
              <div className="w-10 h-10 rounded-xl bg-beauty-pink flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              Komplektis
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {reshapeInfo.includes.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border">
                  <div className="w-5 h-5 rounded-full bg-beauty-pink flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications section */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <div className="w-10 h-10 rounded-xl bg-beauty-teal flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            Tehnilised andmed
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {reshapeInfo?.specifications ? (
              reshapeInfo.specifications.map((spec, i) => (
                <SpecItem key={i} label={spec.label} value={spec.value} />
              ))
            ) : (
              <>
                <SpecItem label="Tootekood" value={product.sku || 'N/A'} />
                <SpecItem label="Kategooria" value={product.categories?.[0] || 'Kehahooldusseadmed'} />
                <SpecItem label="Garantii" value="24 kuud" />
                <SpecItem label="Tarne" value="2-3 tööpäeva" />
              </>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-card rounded-3xl p-8 lg:p-12 border border-border shadow-sm">
          <h2 className="text-2xl lg:text-3xl font-bold mb-8 flex items-center gap-3 text-foreground">
            <div className="w-10 h-10 rounded-xl bg-beauty-teal flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            Korduma Kippuvad Küsimused
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="bg-muted/50 rounded-xl border border-border px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left py-5 hover:no-underline group">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-beauty-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-beauty-teal/20 transition-colors">
                      <span className="text-beauty-teal font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="font-medium text-foreground group-hover:text-beauty-teal transition-colors pr-4">
                      {item.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-12 pr-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-8 p-6 bg-beauty-teal/10 rounded-2xl border border-beauty-teal/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Kas teil on veel küsimusi?</h3>
                <p className="text-muted-foreground text-sm">Meie klienditugi vastab hea meelega kõikidele teie küsimustele.</p>
              </div>
              <Button 
                variant="outline" 
                className="border-beauty-teal/50 text-beauty-teal hover:bg-beauty-teal/10 hover:border-beauty-teal whitespace-nowrap"
              >
                Võta ühendust
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  colorClass 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  colorClass: string;
}) => (
  <div className="group relative bg-card rounded-xl p-4 lg:p-5 border border-border hover:border-beauty-peach transition-all duration-500 overflow-hidden shadow-sm">
    <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-500 text-white`}>
      {icon}
    </div>
    <h3 className="text-sm lg:text-base font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-xs lg:text-sm text-muted-foreground leading-snug">{description}</p>
  </div>
);

const SpecItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center py-4 border-b border-border last:border-0">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default ProductDeviceTemplate;
