import type { Battle, QuizQuestion } from "./battles.types";

// Static, in-app dataset. No database required.
type RawBattle = Omit<Battle, "id"> & { id: string };

export const BATTLES: RawBattle[] = [
  {
    id: "b01",
    slug: "marathon",
    name: "Battle of Marathon",
    year: -490,
    era: "ancient",
    region: "Greece",
    location: "Plain of Marathon, Attica",
    lat: 38.1538,
    lng: 23.9787,
    commanders: [
      { side: "Athens", name: "Miltiades", role: "Strategos" },
      { side: "Persia", name: "Datis", role: "Commander" },
    ],
    forces: { Athens: 10000, Plataea: 1000, Persia: 25000 },
    casualties: { Greeks: 203, Persians: 6400 },
    outcome: "Decisive Greek victory",
    hero_image: "/assets/b1_marathon.jpg",
    summary:
      "An outnumbered Athenian hoplite force routed Darius' Persian expedition, sparing Greek city-states a half-century before Xerxes' return.",
    narrative:
      "When the Persian fleet beached at Marathon, the Athenians marched out alone. Miltiades thinned his centre and weighted the wings, charging the Persians in a sprint that closed the bowshot gap and broke their flanks. The runner Pheidippides carried word back to Athens before collapsing — a legend that christened a sport.",
    background:
      "Persia's first punitive expedition into mainland Greece targeted Athens for its support of the Ionian Revolt. Sparta, mid-festival, would not march in time.",
    course:
      "Miltiades arrayed roughly 10,000 hoplites and 1,000 Plataeans against a much larger Persian force. The thinned Greek centre absorbed the initial push while the strong wings enveloped the Persian flanks and rolled them back to the ships.",
    turning_points:
      "The double envelopment was the hinge — once both Persian flanks broke, the centre had nowhere to retreat except into a killing field by the marsh.",
    aftermath:
      "Athens proved that a citizen phalanx could defeat the empire of the Great King, and a generation of Athenian confidence ripened into the classical age.",
  },
  {
    id: "b02",
    slug: "thermopylae",
    name: "Battle of Thermopylae",
    year: -480,
    era: "ancient",
    region: "Greece",
    location: "Thermopylae Pass, Malis",
    lat: 38.7956,
    lng: 22.5363,
    commanders: [
      { side: "Greek Alliance", name: "Leonidas I", role: "King of Sparta" },
      { side: "Persia", name: "Xerxes I", role: "King of Kings" },
    ],
    forces: { Greeks: 7000, Persia: 150000 },
    casualties: { Greeks: 4000, Persians: 20000 },
    outcome: "Tactical Persian victory; strategic Greek delay",
    hero_image: "/assets/b2_thermopylae.jpg",
    summary:
      "Leonidas held the hot gates for three days against Xerxes' invasion, buying Greece the time it needed to mobilise.",
    narrative:
      "A narrow shelf between cliff and sea funnelled the Persian host into bristling Greek spears. Betrayed by Ephialtes, the Immortals turned the flank along the Anopaea path. Leonidas dismissed the allies and stayed with his Spartans, Thespians, and Thebans to die in place.",
    background:
      "Ten years after Marathon, Xerxes returned with an army of unprecedented size, bridging the Hellespont with ships.",
    course:
      "For two days the phalanx slaughtered Persians in the narrow pass. On the third, Hydarnes led the Immortals over the mountain trail to fall on the Greek rear.",
    turning_points: "Ephialtes' betrayal of the mountain path doomed the defenders.",
    aftermath:
      "Sparta's stand became a moral cornerstone of Greek resistance, leading to the naval victory at Salamis and Plataea's land triumph.",
  },
  {
    id: "b03",
    slug: "hastings",
    name: "Battle of Hastings",
    year: 1066,
    era: "medieval",
    region: "England",
    location: "Senlac Hill, Sussex",
    lat: 50.9136,
    lng: 0.4878,
    commanders: [
      { side: "Normans", name: "William the Conqueror", role: "Duke of Normandy" },
      { side: "English", name: "Harold Godwinson", role: "King of England" },
    ],
    forces: { Normans: 10000, English: 8000 },
    casualties: { Normans: 2000, English: 4000 },
    outcome: "Decisive Norman victory",
    hero_image: "/assets/b3_hastings.jpg",
    summary:
      "William of Normandy broke Harold's shield-wall, killed the king, and toppled Anglo-Saxon England in a single afternoon.",
    narrative:
      "Harold's housecarls planted themselves on the ridge in a wall of round shields. Norman feigned retreats coaxed sections of the line down the slope, where cavalry wheeled and cut them down. As light failed, an arrow found Harold's eye and the kingdom turned.",
    background:
      "The childless death of Edward the Confessor in January 1066 unleashed three claimants. Harold defeated the Norwegians at Stamford Bridge, then force-marched south to face William.",
    course:
      "Norman infantry, archers, and heavy cavalry attacked uphill all day against the Saxon shield-wall. Repeated feigned retreats slowly drew defenders out of formation.",
    turning_points:
      "Harold's death by arrow and sword collapsed the line; his housecarls fought on around his body until the last.",
    aftermath:
      "William was crowned in Westminster on Christmas Day. Anglo-Saxon nobility was dispossessed; the language, law, and architecture of England would never be the same.",
  },
  {
    id: "b04",
    slug: "agincourt",
    name: "Battle of Agincourt",
    year: 1415,
    era: "medieval",
    region: "France",
    location: "Agincourt, Pas-de-Calais",
    lat: 50.4631,
    lng: 2.1419,
    commanders: [
      { side: "England", name: "Henry V", role: "King of England" },
      { side: "France", name: "Charles d'Albret", role: "Constable of France" },
    ],
    forces: { English: 7000, French: 25000 },
    casualties: { English: 400, French: 8000 },
    outcome: "Decisive English victory",
    hero_image: "/assets/b4_agincourt.jpg",
    summary:
      "Henry V's sodden longbowmen shredded the flower of French chivalry in a muddy ploughed field.",
    narrative:
      "A narrowing of woodland funnelled French men-at-arms into a churned mire while English archers loosed yard-long shafts into a slow-walking forest of plate. The French lost dukes by the dozen.",
    background:
      "Reviving English claims to the French throne, Henry landed at Harfleur and tried to march to Calais, fighting only when intercepted.",
    course:
      "Stakes shielded the English archers. The French vanguard, dismounted and exhausted by mud, collapsed under arrows and then the press of their own second line.",
    turning_points:
      "The terrain narrowed the French frontage as they advanced, packing knights together until they could not raise weapons.",
    aftermath:
      "The Treaty of Troyes (1420) made Henry heir to the French throne. His early death undid the gain, but the longbow's mythology endured.",
  },
  {
    id: "b05",
    slug: "waterloo",
    name: "Battle of Waterloo",
    year: 1815,
    era: "napoleonic",
    region: "Belgium",
    location: "Waterloo, Brabant",
    lat: 50.6803,
    lng: 4.4124,
    commanders: [
      { side: "France", name: "Napoleon Bonaparte", role: "Emperor of the French" },
      { side: "Allied", name: "Duke of Wellington", role: "Field Marshal" },
      { side: "Prussia", name: "Gebhard von Blücher", role: "Generalfeldmarschall" },
    ],
    forces: { France: 73000, Allied: 68000, Prussia: 50000 },
    casualties: { France: 41000, Allied: 17000, Prussia: 7000 },
    outcome: "Decisive Coalition victory; Napoleon's final defeat",
    hero_image: "/assets/b5_waterloo.jpg",
    summary:
      "Wellington's squares held the ridge of Mont-Saint-Jean until Blücher's Prussians fell on the French right and ended an era.",
    narrative:
      "All day the French hammered Hougoumont and La Haye Sainte; massed cavalry broke against red squares. Late in the day, the Prussians crashed into Plancenoit, and the Imperial Guard — for the first time — broke.",
    background:
      "Escaped from Elba, Napoleon raced north to crush the British and Prussians before they could combine.",
    course:
      "Initial attacks fixed Wellington's line. D'Erlon's I Corps was routed by Uxbridge's heavy cavalry. Ney's unsupported cavalry charges shattered against infantry squares. The Old Guard's final assault was repulsed at the ridge crest.",
    turning_points:
      "Blücher's late arrival on the French right, combined with the repulse of the Old Guard, broke the army's morale.",
    aftermath:
      "Napoleon abdicated for the last time and was exiled to Saint Helena. The Concert of Europe shaped the continent for the next century.",
  },
  {
    id: "b06",
    slug: "trafalgar",
    name: "Battle of Trafalgar",
    year: 1805,
    era: "napoleonic",
    region: "Atlantic / Spain",
    location: "Cape Trafalgar, Andalusia",
    lat: 36.1833,
    lng: -6.0333,
    commanders: [
      { side: "Britain", name: "Horatio Nelson", role: "Vice-Admiral" },
      { side: "Franco-Spanish", name: "Pierre-Charles Villeneuve", role: "Vice-Admiral" },
    ],
    forces: { Britain: 27, FrancoSpanish: 33 },
    casualties: { Britain: 1700, FrancoSpanish: 13700 },
    outcome: "Decisive British victory",
    hero_image: "/assets/b6_trafalgar.jpg",
    summary:
      "Nelson's two columns pierced the Franco-Spanish line at right angles, securing British naval supremacy for a century.",
    narrative:
      "Signalled 'England expects that every man will do his duty', Nelson drove HMS Victory bow-first into the enemy line, taking and giving raking broadsides. A musket ball from Redoutable found his shoulder; he lived long enough to learn he had won.",
    background:
      "Napoleon needed control of the Channel to invade Britain. Villeneuve's combined fleet sortied from Cádiz under orders to the Mediterranean.",
    course:
      "Nelson split his fleet into two perpendicular columns to break the long enemy line at two points and overwhelm the centre and rear before the van could turn back.",
    turning_points:
      "The unconventional perpendicular attack denied the Franco-Spanish their broadsides during the approach and ensured decisive close-range fights.",
    aftermath:
      "Invasion of Britain was abandoned. The Royal Navy ruled the seas through the Pax Britannica.",
  },
  {
    id: "b07",
    slug: "gaugamela",
    name: "Battle of Gaugamela",
    year: -331,
    era: "ancient",
    region: "Mesopotamia",
    location: "Tel Gomel, modern Iraq",
    lat: 36.36,
    lng: 43.25,
    commanders: [
      { side: "Macedon", name: "Alexander the Great", role: "King of Macedon" },
      { side: "Persia", name: "Darius III", role: "King of Kings" },
    ],
    forces: { Macedon: 47000, Persia: 100000 },
    casualties: { Macedon: 4000, Persia: 50000 },
    outcome: "Decisive Macedonian victory",
    hero_image: "/assets/b7_gaugamela.jpg",
    summary:
      "Alexander's oblique advance pried open the Persian line and sent Darius fleeing, ending the Achaemenid Empire.",
    narrative:
      "On a plain levelled for scythed chariots, Alexander drifted his army diagonally rightward, drawing the Persian left out of position. He led the Companion cavalry in a wedge straight at the king. Darius bolted; the empire bolted with him.",
    background:
      "After Issus, Darius prepared a final stand on ground of his choosing, with chariots and elephants and a vast cavalry advantage.",
    course:
      "Alexander's right-ward drift created a seam in the Persian line. The Companion cavalry struck through it toward Darius' chariot. Parmenion's left held desperately against Mazaeus' horse.",
    turning_points: "Darius' flight at the moment of crisis broke the Persian centre.",
    aftermath:
      "Alexander entered Babylon and Persepolis. The Achaemenid Empire dissolved; the Hellenistic age began.",
  },
  {
    id: "b08",
    slug: "somme",
    name: "Battle of the Somme",
    year: 1916,
    era: "ww1",
    region: "France",
    location: "Picardy, north of the Somme",
    lat: 49.9667,
    lng: 2.65,
    commanders: [
      { side: "Allies", name: "Douglas Haig", role: "Commander BEF" },
      { side: "Germany", name: "Erich von Falkenhayn", role: "Chief of the General Staff" },
    ],
    forces: { Allies: 1500000, Germany: 1000000 },
    casualties: { Allies: 620000, Germany: 465000 },
    outcome: "Tactical stalemate; strategic Allied attrition",
    hero_image: "/assets/b8_somme.jpg",
    summary:
      "A five-month grinding offensive that introduced the tank, killed nearly a million men, and advanced the line a few miles.",
    narrative:
      "On 1 July 1916 the British Army suffered its bloodiest day. A week-long bombardment had failed to cut wire or kill defenders in deep dugouts; men walked into machine guns. The battle ground on through autumn rain and mud.",
    background:
      "Conceived to break the Western Front and relieve pressure on Verdun, the offensive became a symbol of industrial-age slaughter.",
    course:
      "Successive assaults at Mametz Wood, Pozières, and Flers-Courcelette nibbled forward. On 15 September tanks made their battlefield debut.",
    turning_points:
      "The myth of the war-winning breakthrough died here; attrition became doctrine on both sides.",
    aftermath:
      "Falkenhayn was sacked; Hindenburg and Ludendorff withdrew German forces to the Hindenburg Line in early 1917.",
  },
  {
    id: "b09",
    slug: "stalingrad",
    name: "Battle of Stalingrad",
    year: 1943,
    era: "ww2",
    region: "Russia",
    location: "Stalingrad (Volgograd)",
    lat: 48.7080,
    lng: 44.5133,
    commanders: [
      { side: "USSR", name: "Vasily Chuikov", role: "Commander 62nd Army" },
      { side: "USSR", name: "Georgy Zhukov", role: "Deputy Supreme Commander" },
      { side: "Germany", name: "Friedrich Paulus", role: "Commander 6th Army" },
    ],
    forces: { USSR: 1100000, Axis: 1000000 },
    casualties: { USSR: 1100000, Axis: 850000 },
    outcome: "Decisive Soviet victory; strategic turning point in the East",
    hero_image: "/assets/b9_stalingrad.jpg",
    summary:
      "Soviet defenders bled the Wehrmacht street by street, then encircled the 6th Army in Operation Uranus.",
    narrative:
      "Paulus' 6th Army drove into the city in August 1942. The Soviets fought for every workshop and stairwell. In November, Zhukov's pincers smashed the Romanian flanks and closed the ring at Kalach. Paulus surrendered the remnants of his army in February.",
    background:
      "Hitler's 1942 summer offensive split between the Caucasus oil and the city bearing Stalin's name.",
    course:
      "Street fighting in the rubble of factories and the Mamayev Kurgan; Soviet reinforcement across the Volga under fire; Operation Uranus encircled 300,000 Axis troops.",
    turning_points:
      "Hitler's refusal to allow breakout, and the destruction of the Luftwaffe airlift, doomed the pocket.",
    aftermath:
      "The strategic initiative passed to the Red Army for the rest of the war.",
  },
  {
    id: "b10",
    slug: "d-day",
    name: "D-Day — Normandy Landings",
    year: 1944,
    era: "ww2",
    region: "France",
    location: "Normandy beaches",
    lat: 49.4144,
    lng: -0.8242,
    commanders: [
      { side: "Allies", name: "Dwight D. Eisenhower", role: "Supreme Commander AEF" },
      { side: "Allies", name: "Bernard Montgomery", role: "21st Army Group" },
      { side: "Germany", name: "Erwin Rommel", role: "Army Group B" },
    ],
    forces: { Allies: 156000, Germany: 50000 },
    casualties: { Allies: 10000, Germany: 9000 },
    outcome: "Decisive Allied success; foothold in Fortress Europe",
    hero_image: "/assets/b10_dday.jpg",
    summary:
      "The largest amphibious assault in history opened the Western Front against Nazi Germany.",
    narrative:
      "Airborne troops dropped into a darkened Cotentin. At dawn five beaches — Utah, Omaha, Gold, Juno, Sword — boiled with landing craft. Omaha was a near-disaster; by nightfall the beachhead held.",
    background:
      "After two years of planning, Operation Overlord aimed to liberate Western Europe by establishing a lodgement in Normandy.",
    course:
      "Airborne and amphibious assaults seized the flanks and pushed inland against fortified beaches and bocage.",
    turning_points:
      "Beachhead linkup by 12 June, capture of Cherbourg, and the breakout at Saint-Lô in late July.",
    aftermath:
      "Paris was liberated in August; Allied armies stood on the German frontier by autumn.",
  },
  {
    id: "b11",
    slug: "borodino",
    name: "Battle of Borodino",
    year: 1812,
    era: "napoleonic",
    region: "Russia",
    location: "Borodino, west of Moscow",
    lat: 55.5189,
    lng: 35.8253,
    commanders: [
      { side: "France", name: "Napoleon Bonaparte", role: "Emperor of the French" },
      { side: "Russia", name: "Mikhail Kutuzov", role: "Commander-in-Chief" },
    ],
    forces: { France: 130000, Russia: 120000 },
    casualties: { France: 35000, Russia: 45000 },
    outcome: "Tactical French victory; strategic Russian success",
    hero_image: "/assets/b11_borodino.jpg",
    summary:
      "The bloodiest single day of the Napoleonic Wars opened the road to Moscow — but doomed the Grande Armée.",
    narrative:
      "Massed batteries pounded earthworks at the Raevsky redoubt and the Bagration flèches. Kutuzov withdrew in good order, leaving Moscow open and starvation, fire, and winter to do their work.",
    background:
      "Napoleon's invasion of Russia had failed to bring the Tsar to terms; Kutuzov chose to fight before the gates of Moscow.",
    course:
      "Frontal assaults on prepared positions; the flèches changed hands repeatedly; the redoubt fell late in the day.",
    turning_points:
      "Napoleon's refusal to commit the Imperial Guard left the Russian army intact to fight another day.",
    aftermath:
      "Moscow burned; the retreat from Russia destroyed the Grande Armée. The Sixth Coalition formed.",
  },
  {
    id: "b12",
    slug: "midway",
    name: "Battle of Midway",
    year: 1942,
    era: "ww2",
    region: "Pacific",
    location: "Midway Atoll, North Pacific",
    lat: 28.2072,
    lng: -177.3735,
    commanders: [
      { side: "USA", name: "Chester W. Nimitz", role: "CinC Pacific Fleet" },
      { side: "USA", name: "Raymond A. Spruance", role: "Task Force 16" },
      { side: "Japan", name: "Chuichi Nagumo", role: "Kido Butai" },
    ],
    forces: { USA: 3, Japan: 4 },
    casualties: { USA: 1, Japan: 4 },
    outcome: "Decisive American victory; turn of the Pacific war",
    hero_image: "/assets/b12_midway.jpg",
    summary:
      "American dive bombers caught Nagumo's carriers refueling and rearming, sinking four in six minutes.",
    narrative:
      "Forewarned by codebreakers, Nimitz set an ambush. Torpedo bombers drew the Zeros down to sea level; minutes later Dauntlesses from Enterprise and Yorktown pushed over and turned Kaga, Akagi, and Sōryū into pyres. Hiryū followed by evening.",
    background:
      "Yamamoto sought a decisive battle to destroy the U.S. carrier force after Coral Sea.",
    course:
      "Reconnaissance failures and contradictory orders left Japanese decks crammed with armed and fueled aircraft when the American dive bombers arrived.",
    turning_points:
      "The 'five fateful minutes' near 10:25 a.m. on 4 June 1942.",
    aftermath:
      "Japan lost its core carrier striking arm and never regained the strategic initiative.",
  },
  {
    id: "b13",
    slug: "cannae",
    name: "Battle of Cannae",
    year: -216,
    era: "ancient",
    region: "Italy",
    location: "Cannae, Apulia",
    lat: 41.3061,
    lng: 16.1331,
    commanders: [
      { side: "Carthage", name: "Hannibal Barca", role: "General" },
      { side: "Rome", name: "Lucius Aemilius Paullus", role: "Consul" },
      { side: "Rome", name: "Gaius Terentius Varro", role: "Consul" },
    ],
    forces: { Carthage: 50000, Rome: 86000 },
    casualties: { Carthage: 8000, Rome: 60000 },
    outcome: "Decisive Carthaginian victory",
    hero_image: "/assets/b13_cannae.jpg",
    summary:
      "Hannibal's textbook double envelopment annihilated the largest army Rome had ever fielded.",
    narrative:
      "A crescent of Gauls and Spaniards bent back under Roman pressure as African veterans on the wings turned inward. Carthaginian cavalry swept the Roman horse from the field and crashed into the rear. Tens of thousands of legionaries died in a packed mass that could no longer fight.",
    background:
      "Two years into the Second Punic War, Rome sought to crush Hannibal with overwhelming numbers.",
    course:
      "Crescent centre, refused wings, cavalry envelopment from the rear.",
    turning_points:
      "Hasdrubal's cavalry attack on the Roman rear closed the trap.",
    aftermath:
      "Rome reformed its strategy under Fabius Maximus and, years later, brought Hannibal to bay at Zama.",
  },
  {
    id: "b14",
    slug: "tours",
    name: "Battle of Tours",
    year: 732,
    era: "medieval",
    region: "France",
    location: "Between Tours and Poitiers",
    lat: 46.7167,
    lng: 0.4167,
    commanders: [
      { side: "Franks", name: "Charles Martel", role: "Mayor of the Palace" },
      { side: "Umayyad", name: "Abd al-Rahman al-Ghafiqi", role: "Governor of al-Andalus" },
    ],
    forces: { Franks: 20000, Umayyad: 25000 },
    casualties: { Franks: 1000, Umayyad: 10000 },
    outcome: "Decisive Frankish victory",
    hero_image: "/assets/b14_tours.jpg",
    summary:
      "Charles Martel's infantry square broke an Umayyad raid and checked Muslim expansion north of the Pyrenees.",
    narrative:
      "On a wooded plateau the Franks formed a 'wall of ice' that the Andalusi cavalry could not break. A flanking force threatened the Umayyad camp; in the night the Muslims withdrew, leaving al-Ghafiqi dead.",
    background:
      "Following the conquest of Hispania, Umayyad raids pushed into Aquitaine.",
    course:
      "Frankish infantry held the high ground in close formation; repeated cavalry charges failed against the shield wall.",
    turning_points:
      "Rumours of a raid on the baggage train pulled cavalry away from the main fight.",
    aftermath:
      "Charles Martel's prestige founded the Carolingian dynasty; his grandson would be crowned Charlemagne.",
  },
  {
    id: "b15",
    slug: "crecy",
    name: "Battle of Crécy",
    year: 1346,
    era: "medieval",
    region: "France",
    location: "Crécy-en-Ponthieu, Picardy",
    lat: 50.2519,
    lng: 1.8869,
    commanders: [
      { side: "England", name: "Edward III", role: "King of England" },
      { side: "England", name: "Edward the Black Prince", role: "Prince of Wales" },
      { side: "France", name: "Philip VI", role: "King of France" },
    ],
    forces: { England: 14000, France: 30000 },
    casualties: { England: 300, France: 12000 },
    outcome: "Decisive English victory",
    hero_image: "/assets/b15_crecy.jpg",
    summary:
      "English longbowmen broke wave after wave of French chivalry on a sunlit slope, dawning the age of the bow.",
    narrative:
      "Genoese crossbowmen with damp strings were swept aside by an arrow storm. French knights charged into their own retreating allies; the day cost Philip his army and the French aristocracy a generation.",
    background:
      "Edward III's Hundred Years' War campaign saw him land in Normandy and march toward Flanders.",
    course:
      "English archers on the flanks, dismounted men-at-arms in the centre, repeated French cavalry charges, all repulsed.",
    turning_points:
      "The longbow's rate of fire and Edward's chosen defensive ground.",
    aftermath:
      "Edward marched on to besiege and take Calais; the longbow defined English warfare for a century.",
  },
  {
    id: "b16",
    slug: "lepanto",
    name: "Battle of Lepanto",
    year: 1571,
    era: "early_modern",
    region: "Mediterranean",
    location: "Gulf of Patras",
    lat: 38.2667,
    lng: 21.3,
    commanders: [
      { side: "Holy League", name: "John of Austria", role: "Captain-General" },
      { side: "Ottoman", name: "Ali Pasha", role: "Kapudan Pasha" },
    ],
    forces: { HolyLeague: 212, Ottoman: 251 },
    casualties: { HolyLeague: 10000, Ottoman: 25000 },
    outcome: "Decisive Holy League victory",
    hero_image: "/assets/b16_lepanto.jpg",
    summary:
      "The last great galley battle ended Ottoman naval supremacy in the Mediterranean.",
    narrative:
      "Venetian galleasses bristling with cannon shattered the Ottoman line before contact. Boarding actions reddened the gulf; Don Juan's Real took Ali Pasha's flagship and his head.",
    background:
      "Pope Pius V brokered a Holy League of Spain, Venice, and the Papacy to relieve Cyprus from Ottoman invasion.",
    course:
      "Six galleasses anchored the Christian line and broke the Ottoman formation. Heavy boarding fighting followed.",
    turning_points: "Galleass firepower and superior small-arms training of the Spanish infantry.",
    aftermath:
      "Ottoman expansion at sea slowed, though the empire rebuilt its fleet within a year.",
  },
  {
    id: "b17",
    slug: "gettysburg",
    name: "Battle of Gettysburg",
    year: 1863,
    era: "modern",
    region: "United States",
    location: "Gettysburg, Pennsylvania",
    lat: 39.8064,
    lng: -77.2256,
    commanders: [
      { side: "Union", name: "George G. Meade", role: "Army of the Potomac" },
      { side: "Confederacy", name: "Robert E. Lee", role: "Army of Northern Virginia" },
    ],
    forces: { Union: 94000, Confederacy: 71000 },
    casualties: { Union: 23000, Confederacy: 28000 },
    outcome: "Decisive Union victory",
    hero_image: "/assets/b17_gettysburg.jpg",
    summary:
      "Three days of fighting in Pennsylvania broke Lee's invasion of the North and turned the American Civil War.",
    narrative:
      "Day one's meeting engagement north of town drove Union forces to the high ground of Cemetery Hill. Day two saw Longstreet's assault on Little Round Top and the Wheatfield. Day three closed with Pickett's Charge crumbling across a mile of open ground.",
    background:
      "After Chancellorsville, Lee struck north hoping to win a battle that would force European recognition or peace.",
    course:
      "McPherson's Ridge, Devil's Den, Culp's Hill, the Peach Orchard, and finally the deadly stone wall at the Angle.",
    turning_points: "The Union 20th Maine's bayonet charge at Little Round Top; the repulse of Pickett's Charge.",
    aftermath:
      "Lee withdrew across the Potomac. Four months later, Lincoln spoke at the cemetery dedication.",
  },
  {
    id: "b18",
    slug: "marne",
    name: "First Battle of the Marne",
    year: 1914,
    era: "ww1",
    region: "France",
    location: "Marne valley, east of Paris",
    lat: 48.95,
    lng: 3.3,
    commanders: [
      { side: "Allies", name: "Joseph Joffre", role: "Generalissimo" },
      { side: "Allies", name: "Joseph Gallieni", role: "Military Governor of Paris" },
      { side: "Germany", name: "Helmuth von Moltke the Younger", role: "Chief of Staff" },
    ],
    forces: { Allies: 1071000, Germany: 1485000 },
    casualties: { Allies: 250000, Germany: 220000 },
    outcome: "Strategic Allied victory; trench war begins",
    hero_image: "/assets/b18_marne.jpg",
    summary:
      "A French counterstroke — partly carried in Paris taxicabs — halted the Schlieffen-plan offensive and saved France.",
    narrative:
      "When von Kluck's First Army wheeled inside Paris, Gallieni saw the flank. Maunoury's Sixth Army struck the German right; British and French troops poured into the gap between Kluck and Bülow. Moltke ordered the retreat to the Aisne.",
    background:
      "Germany's pre-war plan called for a vast wheel through Belgium to envelop Paris in six weeks.",
    course:
      "Five-day fighting along the Marne; the famed Paris taxis ferried reinforcements to Maunoury's army.",
    turning_points: "The widening gap between the German First and Second Armies forced the general retreat.",
    aftermath:
      "The race to the sea began; by November the Western Front had become a continuous trench line.",
  },
  {
    id: "b19",
    slug: "verdun",
    name: "Battle of Verdun",
    year: 1916,
    era: "ww1",
    region: "France",
    location: "Verdun, Meuse",
    lat: 49.16,
    lng: 5.385,
    commanders: [
      { side: "France", name: "Philippe Pétain", role: "Commander Second Army" },
      { side: "Germany", name: "Erich von Falkenhayn", role: "Chief of the General Staff" },
    ],
    forces: { France: 1140000, Germany: 1250000 },
    casualties: { France: 377000, Germany: 337000 },
    outcome: "French defensive victory",
    hero_image: "/assets/b19_verdun.jpg",
    summary:
      "Falkenhayn's plan to 'bleed France white' became the longest battle of the war — and bled both sides equally.",
    narrative:
      "The Voie Sacrée — the sacred road — kept Verdun supplied as forts Douaumont and Vaux changed hands. 'On les aura' — we'll get them — became Pétain's promise. The line held; Germany did not break France.",
    background:
      "Falkenhayn chose Verdun for the symbolic weight that he believed would force France to ruinous defence.",
    course:
      "Ten months of artillery and infantry attacks across a moonscape of mud and bone.",
    turning_points:
      "Mangin's recapture of Douaumont in October 1916 reversed the tide.",
    aftermath:
      "Verdun became the iconic French battle of the war; Pétain's prestige carried him to the head of the army — and later, infamy.",
  },
  {
    id: "b20",
    slug: "kursk",
    name: "Battle of Kursk",
    year: 1943,
    era: "ww2",
    region: "Russia",
    location: "Kursk salient",
    lat: 51.7367,
    lng: 36.1872,
    commanders: [
      { side: "USSR", name: "Konstantin Rokossovsky", role: "Central Front" },
      { side: "USSR", name: "Nikolai Vatutin", role: "Voronezh Front" },
      { side: "Germany", name: "Erich von Manstein", role: "Army Group South" },
      { side: "Germany", name: "Walther Model", role: "9th Army" },
    ],
    forces: { USSR: 1900000, Germany: 780000 },
    casualties: { USSR: 250000, Germany: 200000 },
    outcome: "Decisive Soviet victory",
    hero_image: "/assets/b20_kursk.jpg",
    summary:
      "The largest tank battle in history broke the Wehrmacht's last great offensive in the East.",
    narrative:
      "Forewarned, the Soviets dug eight defensive belts. Operation Citadel ran into a meat-grinder of anti-tank guns and minefields. At Prokhorovka, hundreds of tanks brawled at point-blank range. Hitler called off Citadel; the Red Army's summer offensive began.",
    background:
      "After Stalingrad, the Germans hoped to pinch off the Kursk bulge before Soviet strength became overwhelming.",
    course:
      "Citadel's pincer attacks were absorbed by defensive depth; Soviet counter-offensives toward Orel and Kharkov followed.",
    turning_points: "The depth of Soviet defences and Hitler's diversion of forces to Italy after the Allied landings in Sicily.",
    aftermath:
      "Strategic initiative on the Eastern Front passed permanently to the Soviets.",
  },
  {
    id: "b21",
    slug: "el-alamein",
    name: "Second Battle of El Alamein",
    year: 1942,
    era: "ww2",
    region: "Egypt",
    location: "El Alamein, Western Desert",
    lat: 30.8333,
    lng: 28.95,
    commanders: [
      { side: "Allies", name: "Bernard Montgomery", role: "Eighth Army" },
      { side: "Axis", name: "Erwin Rommel", role: "Panzerarmee Afrika" },
    ],
    forces: { Allies: 195000, Axis: 116000 },
    casualties: { Allies: 13500, Axis: 37000 },
    outcome: "Decisive Allied victory",
    hero_image: "/assets/b21_alamein.jpg",
    summary:
      "Montgomery's set-piece offensive broke Rommel in the desert and saved Egypt and the Suez Canal.",
    narrative:
      "Operation Lightfoot opened with a thousand-gun barrage. Engineers cleared lanes through 'the Devil's Gardens' of mines; armour poured through in Operation Supercharge. Rommel, ordered to stand fast by Hitler, lost his army's mobility and then his army.",
    background:
      "After Alam Halfa stopped Rommel's last lunge for Egypt, Montgomery rebuilt the Eighth Army for a deliberate offensive.",
    course:
      "Twelve days of attritional fighting through fortified minefields culminated in armoured breakthrough.",
    turning_points: "Supercharge's narrow-front breakthrough and Hitler's stand-fast order.",
    aftermath:
      "It was, as Churchill put it, 'the end of the beginning' — Axis forces were pushed from Egypt to Tunisia.",
  },
];

// ---------- Quizzes ----------
type RawQuiz = Omit<QuizQuestion, "battle_id"> & { battle_slug: string };

const Q: RawQuiz[] = [
  // Marathon
  { id: "q-marathon-1", battle_slug: "marathon", kind: "mc", question: "Who commanded the Athenian hoplites?", options: ["Themistocles", "Miltiades", "Pericles", "Leonidas"], correct_index: 1, explanation: "Miltiades pushed for the attack and thinned the centre to weight the wings.", position: 0 },
  { id: "q-marathon-2", battle_slug: "marathon", kind: "mc", question: "Why did Sparta arrive only after the battle?", options: ["They refused to march", "A religious festival forbade marching", "Their fleet was delayed", "They were besieged at home"], correct_index: 1, explanation: "The Carneia festival kept the Spartan army from marching in time.", position: 1 },
  { id: "q-marathon-3", battle_slug: "marathon", kind: "tf", question: "The legend of the marathon run is tied to this battle.", options: ["True", "False"], correct_index: 0, explanation: "Pheidippides is said to have run from Marathon to Athens to announce the victory.", position: 2 },

  // Thermopylae
  { id: "q-thermo-1", battle_slug: "thermopylae", kind: "mc", question: "Who led the Greek defence?", options: ["Leonidas I", "Pausanias", "Themistocles", "Cleomenes"], correct_index: 0, explanation: "Leonidas, king of Sparta, commanded the allied Greek force.", position: 0 },
  { id: "q-thermo-2", battle_slug: "thermopylae", kind: "mc", question: "Who betrayed the mountain path?", options: ["Pausanias", "Ephialtes", "Hydarnes", "Demaratus"], correct_index: 1, explanation: "Ephialtes guided the Persian Immortals along the Anopaea path.", position: 1 },

  // Hastings
  { id: "q-hastings-1", battle_slug: "hastings", kind: "mc", question: "What tactic finally broke Harold's shield-wall?", options: ["Crossbows", "Feigned retreats", "Greek fire", "Naval flanking"], correct_index: 1, explanation: "Norman feigned retreats drew sections of the line off the ridge.", position: 0 },
  { id: "q-hastings-2", battle_slug: "hastings", kind: "tf", question: "Harold had just won the Battle of Stamford Bridge weeks earlier.", options: ["True", "False"], correct_index: 0, explanation: "Harold defeated a Norwegian invasion at Stamford Bridge in September 1066.", position: 1 },

  // Agincourt
  { id: "q-agincourt-1", battle_slug: "agincourt", kind: "mc", question: "Which weapon decided the battle?", options: ["Crossbow", "Longbow", "Pike", "Halberd"], correct_index: 1, explanation: "English longbows shredded the densely packed French men-at-arms.", position: 0 },
  { id: "q-agincourt-2", battle_slug: "agincourt", kind: "mc", question: "Who commanded the English?", options: ["Edward III", "Henry V", "Edward the Black Prince", "Richard II"], correct_index: 1, explanation: "Henry V led the English in person.", position: 1 },

  // Waterloo
  { id: "q-waterloo-1", battle_slug: "waterloo", kind: "mc", question: "Whose late arrival sealed Napoleon's fate?", options: ["Blücher", "Grouchy", "Bernadotte", "Bagration"], correct_index: 0, explanation: "Blücher's Prussians struck the French right at Plancenoit.", position: 0 },
  { id: "q-waterloo-2", battle_slug: "waterloo", kind: "tf", question: "The Imperial Guard was repulsed for the first time in the battle.", options: ["True", "False"], correct_index: 0, explanation: "The Old Guard's final attack broke against the British line.", position: 1 },

  // Trafalgar
  { id: "q-trafalgar-1", battle_slug: "trafalgar", kind: "mc", question: "What did Nelson's signal say?", options: ["Engage the enemy more closely", "England expects that every man will do his duty", "Victory or death", "God save the King"], correct_index: 1, explanation: "Famously hoisted before the action began.", position: 0 },
  { id: "q-trafalgar-2", battle_slug: "trafalgar", kind: "mc", question: "How did Nelson attack the enemy line?", options: ["A single line abreast", "Two perpendicular columns", "From windward in line ahead", "A crossing of the T"], correct_index: 1, explanation: "Two columns broke the Franco-Spanish line at two points.", position: 1 },

  // Gaugamela
  { id: "q-gaugamela-1", battle_slug: "gaugamela", kind: "mc", question: "Who was the Persian Great King?", options: ["Cyrus II", "Darius III", "Xerxes I", "Cambyses II"], correct_index: 1, explanation: "Darius III commanded the Persian army.", position: 0 },
  { id: "q-gaugamela-2", battle_slug: "gaugamela", kind: "tf", question: "Alexander led the Companion cavalry personally.", options: ["True", "False"], correct_index: 0, explanation: "Alexander struck the wedge at the head of the Companions.", position: 1 },

  // Somme
  { id: "q-somme-1", battle_slug: "somme", kind: "mc", question: "What weapon debuted on 15 September 1916?", options: ["Submarine", "Tank", "Flamethrower", "Poison gas"], correct_index: 1, explanation: "British tanks debuted at Flers-Courcelette.", position: 0 },
  { id: "q-somme-2", battle_slug: "somme", kind: "tf", question: "The British Army suffered its bloodiest day ever on 1 July 1916.", options: ["True", "False"], correct_index: 0, explanation: "Nearly 20,000 dead and 40,000 wounded on the first day.", position: 1 },

  // Stalingrad
  { id: "q-stalingrad-1", battle_slug: "stalingrad", kind: "mc", question: "What was the Soviet encirclement operation called?", options: ["Bagration", "Uranus", "Mars", "Saturn"], correct_index: 1, explanation: "Operation Uranus encircled the German 6th Army.", position: 0 },
  { id: "q-stalingrad-2", battle_slug: "stalingrad", kind: "mc", question: "Which German general surrendered the pocket?", options: ["Manstein", "Paulus", "Hoth", "Model"], correct_index: 1, explanation: "Field Marshal Paulus surrendered in February 1943.", position: 1 },

  // D-Day
  { id: "q-dday-1", battle_slug: "d-day", kind: "mc", question: "Which beach saw the bloodiest American fighting?", options: ["Utah", "Omaha", "Gold", "Sword"], correct_index: 1, explanation: "Omaha was a near-disaster for the U.S. assault troops.", position: 0 },
  { id: "q-dday-2", battle_slug: "d-day", kind: "mc", question: "What was the Allied operation called?", options: ["Market Garden", "Overlord", "Husky", "Torch"], correct_index: 1, explanation: "Operation Overlord was the invasion of Normandy.", position: 1 },

  // Borodino
  { id: "q-borodino-1", battle_slug: "borodino", kind: "mc", question: "Which formation did Napoleon refuse to commit?", options: ["The Old Guard", "The cuirassiers", "The Polish lancers", "The Young Guard"], correct_index: 0, explanation: "Holding back the Old Guard left the Russian army intact.", position: 0 },

  // Midway
  { id: "q-midway-1", battle_slug: "midway", kind: "mc", question: "How many Japanese fleet carriers were sunk?", options: ["2", "3", "4", "6"], correct_index: 2, explanation: "Akagi, Kaga, Sōryū, and Hiryū were all lost.", position: 0 },
  { id: "q-midway-2", battle_slug: "midway", kind: "tf", question: "American codebreakers had read part of the Japanese plan.", options: ["True", "False"], correct_index: 0, explanation: "JN-25 decrypts let Nimitz ambush the Kido Butai.", position: 1 },

  // Cannae
  { id: "q-cannae-1", battle_slug: "cannae", kind: "mc", question: "Hannibal's manoeuvre is studied as the classical example of…", options: ["Oblique order", "Double envelopment", "Refused flank", "Defence in depth"], correct_index: 1, explanation: "Cannae remains the textbook double envelopment.", position: 0 },

  // Tours
  { id: "q-tours-1", battle_slug: "tours", kind: "mc", question: "Who commanded the Franks?", options: ["Pepin the Short", "Charles Martel", "Charlemagne", "Clovis I"], correct_index: 1, explanation: "Charles 'the Hammer' Martel led the Frankish army.", position: 0 },

  // Crécy
  { id: "q-crecy-1", battle_slug: "crecy", kind: "mc", question: "Which mercenaries were broken before the French knights even engaged?", options: ["Swiss pikemen", "Genoese crossbowmen", "Catalan almogavars", "Brabançon spearmen"], correct_index: 1, explanation: "Damp strings and longbow rate of fire ruined the Genoese.", position: 0 },

  // Lepanto
  { id: "q-lepanto-1", battle_slug: "lepanto", kind: "mc", question: "Which ship type devastated the Ottoman line?", options: ["Galleon", "Galleass", "Carrack", "Frigate"], correct_index: 1, explanation: "Six Venetian galleasses anchored the Holy League line.", position: 0 },

  // Gettysburg
  { id: "q-gettysburg-1", battle_slug: "gettysburg", kind: "mc", question: "What is the famous day-three Confederate assault called?", options: ["Pickett's Charge", "Stonewall's Stand", "Longstreet's Lunge", "Jackson's Rush"], correct_index: 0, explanation: "Pickett's Charge crossed nearly a mile of open ground.", position: 0 },
  { id: "q-gettysburg-2", battle_slug: "gettysburg", kind: "mc", question: "Which regiment is famed for the bayonet charge at Little Round Top?", options: ["20th Maine", "1st Minnesota", "5th New York", "69th Pennsylvania"], correct_index: 0, explanation: "Joshua Chamberlain's 20th Maine fixed bayonets and charged.", position: 1 },

  // Marne
  { id: "q-marne-1", battle_slug: "marne", kind: "mc", question: "What unusual transport ferried French reserves to the front?", options: ["Bicycles", "Paris taxis", "River barges", "Hot-air balloons"], correct_index: 1, explanation: "The Paris taxis carried troops to Maunoury's army.", position: 0 },

  // Verdun
  { id: "q-verdun-1", battle_slug: "verdun", kind: "mc", question: "What was the supply road to Verdun called?", options: ["La Voie Sacrée", "La Marne", "La Route du Roi", "La Voie Royale"], correct_index: 0, explanation: "The 'Sacred Way' kept Verdun supplied.", position: 0 },

  // Kursk
  { id: "q-kursk-1", battle_slug: "kursk", kind: "mc", question: "Where did the largest tank engagement of Kursk occur?", options: ["Orel", "Prokhorovka", "Belgorod", "Kharkov"], correct_index: 1, explanation: "Prokhorovka saw the climactic armoured clash.", position: 0 },
  { id: "q-kursk-2", battle_slug: "kursk", kind: "mc", question: "What was the German offensive named?", options: ["Citadel", "Typhoon", "Blue", "Steinbock"], correct_index: 0, explanation: "Operation Citadel was Germany's last great Eastern offensive.", position: 1 },

  // El Alamein
  { id: "q-alamein-1", battle_slug: "el-alamein", kind: "mc", question: "Who commanded the Eighth Army?", options: ["Auchinleck", "Montgomery", "Alexander", "Wavell"], correct_index: 1, explanation: "Montgomery had taken over after the first Alamein battle.", position: 0 },
  { id: "q-alamein-2", battle_slug: "el-alamein", kind: "mc", question: "What was the opening operation called?", options: ["Lightfoot", "Supercharge", "Crusader", "Compass"], correct_index: 0, explanation: "Operation Lightfoot opened with a thousand-gun barrage.", position: 1 },
];

const slugToId = new Map(BATTLES.map((b) => [b.slug, b.id]));

export const QUIZZES: QuizQuestion[] = Q.map((q) => ({
  id: q.id,
  battle_id: slugToId.get(q.battle_slug) ?? "",
  kind: q.kind,
  question: q.question,
  options: q.options,
  correct_index: q.correct_index,
  explanation: q.explanation ?? null,
  position: q.position,
}));
