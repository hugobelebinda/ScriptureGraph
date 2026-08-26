import type { City } from "./citiesData";

export const SYRIA: City[] = [
  {
    id: "damascus",
    nameEn: "Damascus",
    nameFr: "Damas",
    lng: 36.30639,
    lat: 33.511112,
    tier: "major",
    region: "syria",
    blurbEn:
      "An oasis capital older than Israel, the seat of Aram, and the city on whose road Saul of Tarsus was stopped.",
    blurbFr:
      "Une capitale-oasis plus ancienne qu'Israël, siège d'Aram, et la ville sur le chemin de laquelle Saul de Tarse fut arrêté.",
    source: {
      site: "Damascus",
      confidence: 1000,
      candidates: 1,
      slug: "damascus",
    },
    curated: true,
    events: [
      {
        id: "damascus-abraham-steward",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Abraham's heir-apparent is Eliezer of Damascus",
        labelFr: "L'héritier pressenti d'Abraham est Éliézer de Damas",
        refs: [{ usfm: "GEN", ref: "15:2" }],
      },
      {
        id: "damascus-david",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "David garrisons it after defeating the Arameans",
        labelFr: "David y met garnison après avoir battu les Araméens",
        refs: [{ usfm: "2SA", ref: "8:5-6" }],
      },
      {
        id: "damascus-rezaon",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Rezon makes it the capital of a kingdom hostile to Solomon",
        labelFr:
          "Rezon en fait la capitale d'un royaume hostile à Salomon",
        refs: [{ usfm: "1KI", ref: "11:23-25" }],
      },
      {
        id: "damascus-asa-bribe",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Asa of Judah bribes Ben-hadad to break his treaty with Israel",
        labelFr:
          "Asa de Juda paie Ben-Hadad pour qu'il rompe son traité avec Israël",
        refs: [{ usfm: "1KI", ref: "15:18-20" }],
      },
      {
        id: "damascus-elisha",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Elisha weeps in front of Hazael, then anoints him with a hard word",
        labelFr:
          "Élisée pleure devant Hazaël, puis l'oint d'une parole dure",
        descriptionEn:
          "Ben-hadad sends Hazael to ask whether he will recover. Elisha tells Hazael to say yes, then stares until the man is ashamed, and weeps. He has seen what Hazael will do to Israel. The next day Hazael smothers the king and sits on his throne.",
        descriptionFr:
          "Ben-Hadad envoie Hazaël demander s'il en réchappera. Élisée dit à Hazaël de répondre oui, puis le fixe jusqu'à ce que l'homme ait honte, et pleure. Il a vu ce que Hazaël fera à Israël. Le lendemain, Hazaël étouffe le roi et s'assied sur son trône.",
        refs: [{ usfm: "2KI", ref: "8:7-15" }],
      },
      {
        id: "damascus-ahaz-altar",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Ahaz copies its altar and has one built in the temple court",
        labelFr:
          "Achaz en copie l'autel et en fait construire un dans le parvis du temple",
        refs: [{ usfm: "2KI", ref: "16:10-16" }],
      },
      {
        id: "damascus-isaiah",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Isaiah says Damascus will become a heap, no longer a city",
        labelFr: "Ésaïe dit que Damas deviendra un monceau, et non plus une ville",
        refs: [{ usfm: "ISA", ref: "17:1-3" }],
      },
      {
        id: "damascus-assyria",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Tiglath-pileser takes the city and kills Rezin",
        labelFr: "Tiglath-Piléser prend la ville et tue Retsin",
        refs: [{ usfm: "2KI", ref: "16:9" }],
      },
      {
        id: "damascus-saul",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "A light on the road stops Saul, who came to arrest the church",
        labelFr:
          "Une lumière sur le chemin arrête Saul, venu pour saisir l'Église",
        descriptionEn:
          "Letters from the high priest in his bag, Saul is nearing the city when a light drops him in the road and a voice asks why he is persecuting him. He is led in blind. For three days he neither eats nor sees, until a reluctant disciple named Ananias is sent to the house on Straight Street.",
        descriptionFr:
          "Les lettres du grand prêtre dans son sac, Saul approche de la ville quand une lumière le jette à terre et qu'une voix demande pourquoi il le persécute. On le conduit, aveugle. Trois jours durant il ne mange ni ne voit, jusqu'à ce qu'un disciple réticent, Ananias, soit envoyé à la maison de la rue Droite.",
        refs: [{ usfm: "ACT", ref: "9:1-19" }],
      },
      {
        id: "damascus-preaches",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "He preaches in the synagogues, then is lowered in a basket",
        labelFr: "Il prêche dans les synagogues, puis on le descend dans une corbeille",
        descriptionEn:
          "The man who came to bind the disciples starts arguing that Jesus is the Son of God. The Jews plot to kill him and watch the gates day and night. The disciples let him down through the wall, and he goes back to Jerusalem a convert the church is still afraid of.",
        descriptionFr:
          "L'homme venu lier les disciples se met à soutenir que Jésus est le Fils de Dieu. Les Juifs complotent de le tuer et gardent les portes jour et nuit. Les disciples le descendent par la muraille, et il rentre à Jérusalem en converti dont l'Église a encore peur.",
        refs: [
          { usfm: "ACT", ref: "9:20-25" },
          { usfm: "2CO", ref: "11:32-33" },
        ],
      },
    ],
  },
  {
    id: "antioch",
    nameEn: "Antioch",
    nameFr: "Antioche",
    lng: 36.171743,
    lat: 36.226691,
    tier: "notable",
    region: "syria",
    blurbEn:
      "The Roman capital of Syria, where the disciples were first called Christians and from which every one of Paul's missionary journeys set out.",
    blurbFr:
      "La capitale romaine de Syrie, où les disciples furent pour la première fois appelés chrétiens et d'où partirent tous les voyages missionnaires de Paul.",
    source: {
      site: "Antioch on the Orontes",
      confidence: 1000,
      candidates: 1,
      slug: "antioch-1",
    },
    curated: true,
    events: [
      {
        id: "antioch-scattered",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Believers scattered by Stephen's death begin speaking to Greeks here",
        labelFr:
          "Des croyants dispersés par la mort d'Étienne se mettent ici à parler aux Grecs",
        refs: [{ usfm: "ACT", ref: "11:19-21" }],
      },
      {
        id: "antioch-barnabas-saul",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Barnabas fetches Saul from Tarsus, and the name Christian starts here",
        labelFr:
          "Barnabas va chercher Saul à Tarse, et le nom de chrétien naît ici",
        descriptionEn:
          "The Jerusalem church sends Barnabas to inspect what is happening among the Greeks. He is glad, then goes to Tarsus for Saul, and the two of them teach for a year. Luke notes, almost in passing, that it was in Antioch that the disciples were first called Christians.",
        descriptionFr:
          "L'église de Jérusalem envoie Barnabas voir ce qui se passe parmi les Grecs. Il s'en réjouit, puis va chercher Saul à Tarse, et tous deux enseignent pendant un an. Luc note, presque en passant, que ce fut à Antioche que les disciples furent pour la première fois appelés chrétiens.",
        refs: [{ usfm: "ACT", ref: "11:22-26" }],
      },
      {
        id: "antioch-relief",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "The church sends famine relief to Judea by Barnabas and Saul",
        labelFr:
          "L'église envoie des secours à la Judée par Barnabas et Saul",
        refs: [{ usfm: "ACT", ref: "11:27-30" }],
      },
      {
        id: "antioch-sent",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "The Spirit says to set Barnabas and Saul apart, and the church sends them",
        labelFr:
          "L'Esprit dit de mettre à part Barnabas et Saul, et l'église les envoie",
        descriptionEn:
          "While the prophets and teachers are worshipping and fasting, the Spirit names two of them. The church fasts again, lays hands on them, and lets them go. Every later journey of Paul starts from this sending, and returns to report to this room.",
        descriptionFr:
          "Tandis que les prophètes et les docteurs rendent un culte et jeûnent, l'Esprit en nomme deux. L'église jeûne encore, leur impose les mains et les laisse partir. Tous les voyages suivants de Paul partent de cet envoi, et reviennent rendre compte dans cette salle.",
        refs: [{ usfm: "ACT", ref: "13:1-3" }],
      },
      {
        id: "antioch-report",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "They return and tell the church what God has done among the Gentiles",
        labelFr:
          "Ils reviennent et racontent à l'église ce que Dieu a fait parmi les païens",
        refs: [{ usfm: "ACT", ref: "14:26-28" }],
      },
      {
        id: "antioch-peter-paul",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul opposes Peter to his face when the table splits",
        labelFr: "Paul s'oppose à Pierre en face quand la table se divise",
        descriptionEn:
          "Peter has been eating with Gentile believers until men come from James. Then he draws back, and the rest of the Jews with him, including Barnabas. Paul calls the withdrawal what it is: a refusal of the gospel they had already agreed on in Jerusalem.",
        descriptionFr:
          "Pierre mangeait avec les croyants païens jusqu'à l'arrivée d'hommes venus de chez Jacques. Alors il se retire, et les autres Juifs avec lui, Barnabas compris. Paul nomme ce retrait pour ce qu'il est : un refus de l'Évangile dont ils étaient déjà convenus à Jérusalem.",
        refs: [{ usfm: "GAL", ref: "2:11-14" }],
      },
      {
        id: "antioch-split",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Paul and Barnabas part over John Mark, and two missions leave instead of one",
        labelFr:
          "Paul et Barnabas se séparent à propos de Jean-Marc, et deux missions partent au lieu d'une",
        refs: [{ usfm: "ACT", ref: "15:36-41" }],
      },
    ],
  },
];

export const MESOPOTAMIA: City[] = [
  {
    id: "babylon",
    nameEn: "Babylon",
    nameFr: "Babylone",
    lng: 44.422222,
    lat: 32.543333,
    tier: "primary",
    region: "mesopotamia",
    blurbEn:
      "The city that took Jerusalem, housed the exile, and became the Bible's standing name for an empire that swallows the people of God.",
    blurbFr:
      "La ville qui prit Jérusalem, abrita l'exil, et dont la Bible a fait le nom même de l'empire qui avale le peuple de Dieu.",
    source: {
      site: "Babylon",
      confidence: 1000,
      candidates: 1,
      slug: "babylon-1",
    },
    curated: true,
    events: [
      {
        id: "babylon-babel",
        period: "patriarchs",
        weight: "headline",
        labelEn: "A tower is begun so that its builders will not be scattered",
        labelFr:
          "On commence une tour pour que ses bâtisseurs ne soient pas dispersés",
        descriptionEn:
          "The plain of Shinar gathers a people who want a name and a city that will keep them in one place. The Lord comes down, confuses the language, and scatters them anyway. The city keeps the name of the confusion.",
        descriptionFr:
          "La plaine de Shinéar rassemble un peuple qui veut un nom et une ville qui le tienne en un seul lieu. L'Éternel descend, confond la langue, et les disperse quand même. La ville garde le nom de la confusion.",
        refs: [{ usfm: "GEN", ref: "11:1-9" }],
      },
      {
        id: "babylon-merodach",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Merodach-baladan's envoys see Hezekiah's whole treasury",
        labelFr:
          "Les envoyés de Merodac-Baladan voient tout le trésor d'Ézéchias",
        refs: [{ usfm: "2KI", ref: "20:12-19" }],
      },
      {
        id: "babylon-first-deportation",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Jehoiachin and the skilled of the land are taken in the first deportation",
        labelFr:
          "Jojakin et les gens de métier du pays sont emmenés à la première déportation",
        refs: [{ usfm: "2KI", ref: "24:10-16" }],
      },
      {
        id: "babylon-daniel",
        period: "exileReturn",
        weight: "headline",
        labelEn: "Daniel and three friends are trained in the language of the Chaldeans",
        labelFr:
          "Daniel et trois amis sont formés à la langue des Chaldéens",
        descriptionEn:
          "Young men of the royal family are enrolled in a three-year course meant to turn them into Babylonian officials. They keep their own food and their own names before God, and they outdo the rest of the class. The exile begins as an education.",
        descriptionFr:
          "De jeunes gens de sang royal sont inscrits à une formation de trois ans destinée à en faire des fonctionnaires babyloniens. Ils gardent leur nourriture et leurs noms devant Dieu, et ils surpassent le reste de la classe. L'exil commence comme une école.",
        refs: [{ usfm: "DAN", ref: "1:1-21" }],
      },
      {
        id: "babylon-statue",
        period: "exileReturn",
        weight: "headline",
        labelEn: "Nebuchadnezzar dreams a statue, and Daniel tells him what it is",
        labelFr:
          "Nebucadnetsar rêve d'une statue, et Daniel lui dit ce qu'elle est",
        descriptionEn:
          "The king will kill every sage in the city if no one can recover a dream he has forgotten. Daniel asks for time, is shown the image of gold and clay, and tells Nebuchadnezzar that his kingdom is the head, and that a stone not cut by hands will bring the whole thing down.",
        descriptionFr:
          "Le roi tuera tous les sages de la ville si personne ne retrouve un songe qu'il a oublié. Daniel demande du temps, se voit montrer l'image d'or et d'argile, et dit à Nebucadnetsar que son royaume est la tête, et qu'une pierre non taillée de main d'homme fera tout crouler.",
        refs: [{ usfm: "DAN", ref: "2:1-45" }],
      },
      {
        id: "babylon-furnace",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Three men will not bow to the golden image, and a fourth walks in the fire",
        labelFr:
          "Trois hommes ne se prosternent pas devant l'image d'or, et un quatrième marche dans le feu",
        refs: [{ usfm: "DAN", ref: "3:1-30" }],
      },
      {
        id: "babylon-nebuchadnezzar-humbled",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Nebuchadnezzar is driven out among the beasts until he lifts his eyes",
        labelFr:
          "Nebucadnetsar est chassé parmi les bêtes jusqu'à ce qu'il lève les yeux",
        refs: [{ usfm: "DAN", ref: "4:28-37" }],
      },
      {
        id: "babylon-lions",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Daniel is thrown to the lions for praying toward Jerusalem",
        labelFr: "Daniel est jeté aux lions pour avoir prié vers Jérusalem",
        refs: [{ usfm: "DAN", ref: "6:10-23" }],
      },
      {
        id: "babylon-ezekiel-call",
        period: "exileReturn",
        weight: "notable",
        labelEn: "Ezekiel sees the heavens open by the river Chebar",
        labelFr: "Ézéchiel voit les cieux s'ouvrir près du fleuve du Kebar",
        refs: [{ usfm: "EZK", ref: "1:1-28" }],
      },
      {
        id: "babylon-jehoiachin-released",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Jehoiachin is brought out of prison and eats at the king's table",
        labelFr:
          "Jojakin est tiré de prison et mange à la table du roi",
        refs: [{ usfm: "2KI", ref: "25:27-30" }],
      },
      {
        id: "babylon-fall-of-jerusalem",
        period: "exileReturn",
        weight: "headline",
        labelEn: "News reaches the exiles that the city and the temple have burned",
        labelFr:
          "La nouvelle parvient aux exilés que la ville et le temple ont brûlé",
        descriptionEn:
          "Ezekiel has been in Babylon for years when a fugitive arrives and says the city has fallen. The same day the prophet's mouth is opened. Jeremiah, still in Judah, writes that the vessels of the house of the Lord have been carried here, and that the exile will last seventy years.",
        descriptionFr:
          "Ézéchiel est à Babylone depuis des années quand un fuyard arrive et dit que la ville est tombée. Le même jour, la bouche du prophète s'ouvre. Jérémie, encore en Juda, écrit que les ustensiles de la maison de l'Éternel ont été emportés ici, et que l'exil durera soixante-dix ans.",
        refs: [
          { usfm: "EZK", ref: "33:21-22" },
          { usfm: "JER", ref: "29:1-14" },
        ],
      },
      {
        id: "babylon-psalm",
        period: "exileReturn",
        weight: "notable",
        labelEn: "By the rivers, they hang up their lyres and are asked for a song",
        labelFr:
          "Près des fleuves, ils pendent leurs lyres et on leur demande un chant",
        refs: [{ usfm: "PSA", ref: "137:1-6" }],
      },
      {
        id: "babylon-writing-on-wall",
        period: "exileReturn",
        weight: "headline",
        labelEn: "A hand writes on the plaster during Belshazzar's feast",
        labelFr: "Une main écrit sur le plâtre pendant le festin de Belshatsar",
        descriptionEn:
          "The king uses the temple vessels to drink from, and praises gods of gold and silver. Fingers write a sentence no one in the room can read. Daniel is fetched from retirement and tells him he has been weighed and found wanting; that night the city falls to the Medes.",
        descriptionFr:
          "Le roi se sert des vases du temple pour boire, et loue des dieux d'or et d'argent. Des doigts écrivent une sentence que personne dans la salle ne sait lire. On tire Daniel de sa retraite, et il lui dit qu'il a été pesé et trouvé léger ; cette nuit-là, la ville tombe aux Mèdes.",
        refs: [{ usfm: "DAN", ref: "5:1-31" }],
      },
      {
        id: "babylon-cyrus",
        period: "exileReturn",
        weight: "headline",
        labelEn: "Cyrus tells the exiles they may go home and rebuild the house",
        labelFr:
          "Cyrus dit aux exilés qu'ils peuvent rentrer et rebâtir la maison",
        descriptionEn:
          "In his first year the Persian king issues a written decree: the Lord, the God of heaven, has charged him to build a house in Jerusalem, and whoever belongs to that people may go up. Ezra opens with the inventory of vessels coming out of the treasury of Babylon and starting the road west.",
        descriptionFr:
          "Dès sa première année, le roi perse rend un décret écrit : l'Éternel, le Dieu des cieux, lui a donné charge de bâtir une maison à Jérusalem, et quiconque appartient à ce peuple peut y monter. Esdras s'ouvre sur l'inventaire des vases qui sortent du trésor de Babylone et prennent la route de l'ouest.",
        refs: [{ usfm: "EZR", ref: "1:1-11" }],
      },
      {
        id: "babylon-ezra-leaves",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Ezra gathers the second caravan by the river Ahava",
        labelFr: "Esdras rassemble la seconde caravane près du fleuve d'Ahava",
        refs: [{ usfm: "EZR", ref: "8:15-31" }],
      },
      {
        id: "babylon-revelation",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Revelation names it again: the great city that made the nations drunk",
        labelFr:
          "L'Apocalypse la nomme encore : la grande ville qui a enivré les nations",
        refs: [{ usfm: "REV", ref: "18:1-24" }],
      },
    ],
  },
  {
    id: "nineveh",
    nameEn: "Nineveh",
    nameFr: "Ninive",
    lng: 43.1528,
    lat: 36.3594,
    tier: "notable",
    region: "mesopotamia",
    blurbEn:
      "The great city of Assyria, spared when it repented at Jonah's preaching and later razed so completely that its fall became a proverb.",
    blurbFr:
      "La grande ville d'Assyrie, épargnée lorsqu'elle se repentit à la prédication de Jonas, puis rasée si complètement que sa chute devint un proverbe.",
    source: {
      site: "Nineveh",
      confidence: 1000,
      candidates: 1,
      slug: "nineveh",
    },
    curated: true,
    events: [
      {
        id: "nineveh-founded",
        period: "patriarchs",
        weight: "reference",
        labelEn: "Nimrod goes into Assyria and builds Nineveh",
        labelFr: "Nimrod entre en Assyrie et bâtit Ninive",
        refs: [{ usfm: "GEN", ref: "10:11" }],
      },
      {
        id: "nineveh-jonah-sent",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Jonah is told to go and cry out against it",
        labelFr: "Jonas reçoit l'ordre d'y aller crier contre elle",
        refs: [{ usfm: "JON", ref: "1:1-2" }],
      },
      {
        id: "nineveh-repents",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "The city puts on sackcloth, from the king to the beasts",
        labelFr: "La ville se couvre de sac, du roi jusqu'aux bêtes",
        descriptionEn:
          "Jonah walks a day's journey in and says the city has forty days. Nineveh believes God. The king comes down from his throne, a fast is proclaimed, and even the animals are covered. God sees that they have turned from the violence in their hands, and he does not do it.",
        descriptionFr:
          "Jonas marche un jour dans la ville et dit qu'il lui reste quarante jours. Ninive croit Dieu. Le roi descend de son trône, un jeûne est publié, et jusqu'aux bêtes on couvre de sac. Dieu voit qu'ils se sont détournés de la violence de leurs mains, et il ne le fait pas.",
        refs: [{ usfm: "JON", ref: "3:1-10" }],
      },
      {
        id: "nineveh-jonah-angry",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Jonah is angry that the city was spared, and a plant teaches him why",
        labelFr:
          "Jonas se fâche que la ville ait été épargnée, et une plante lui en donne la raison",
        refs: [{ usfm: "JON", ref: "4:1-11" }],
      },
      {
        id: "nineveh-sennacherib",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Sennacherib goes home to it and is killed in the house of his god",
        labelFr:
          "Sanchérib y rentre et est tué dans la maison de son dieu",
        refs: [{ usfm: "2KI", ref: "19:36-37" }],
      },
      {
        id: "nineveh-nahum",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Nahum describes the city opening to the river and the palace melting",
        labelFr:
          "Nahum décrit la ville qui s'ouvre au fleuve et le palais qui fond",
        descriptionEn:
          "The book is an oracle against the city Jonah saw spared. Nahum watches the chariots rage in the streets, the river-gates open, and the place that had emptied nations being emptied itself. There is no second repentance in this account.",
        descriptionFr:
          "Le livre est un oracle contre la ville que Jonas avait vue épargnée. Nahum voit les chars se ruer dans les rues, les portes du fleuve s'ouvrir, et le lieu qui avait vidé les nations se vider à son tour. Il n'y a pas de second repentir dans ce récit.",
        refs: [{ usfm: "NAM", ref: "2:1-13" }],
      },
      {
        id: "nineveh-jesus",
        period: "gospels",
        weight: "notable",
        labelEn: "Jesus says the men of Nineveh will stand up and condemn this generation",
        labelFr:
          "Jésus dit que les hommes de Ninive se lèveront et condamneront cette génération",
        refs: [{ usfm: "MAT", ref: "12:41" }],
      },
    ],
  },
  {
    id: "ur",
    nameEn: "Ur",
    nameFr: "Ur",
    lng: 46.104444,
    lat: 30.962222,
    tier: "minor",
    region: "mesopotamia",
    blurbEn:
      "A Sumerian city on the lower Euphrates, the place Joshua says Abraham's fathers served other gods, and the place God called him out of.",
    blurbFr:
      "Une ville sumérienne sur le bas Euphrate, le lieu où, dit Josué, les pères d'Abraham servaient d'autres dieux, et celui dont Dieu l'appela à sortir.",
    source: {
      site: "Tell el Muqayyar",
      confidence: 703,
      candidates: 4,
      slug: "ur-1",
    },
    events: [
      {
        id: "ur-terah",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Terah's family lives here, and Haran dies before his father",
        labelFr: "La famille de Térach y habite, et Haran meurt avant son père",
        refs: [{ usfm: "GEN", ref: "11:27-28" }],
      },
      {
        id: "ur-called",
        period: "patriarchs",
        weight: "headline",
        labelEn: "God takes Abraham out of Ur of the Chaldeans",
        labelFr: "Dieu fait sortir Abraham d'Ur en Chaldée",
        descriptionEn:
          "The call is remembered twice: in the narrative as the family's departure, and later as God's own summary to Abraham — I am the Lord who brought you out of Ur to give you this land. Stephen, centuries on, starts the same story from this city.",
        descriptionFr:
          "L'appel est rappelé deux fois : dans le récit, comme le départ de la famille, et plus tard comme le résumé que Dieu en fait à Abraham — je suis l'Éternel qui t'ai fait sortir d'Ur pour te donner ce pays. Étienne, des siècles plus tard, commence la même histoire depuis cette ville.",
        refs: [
          { usfm: "GEN", ref: "15:7" },
          { usfm: "ACT", ref: "7:2-4" },
        ],
      },
      {
        id: "ur-departure",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Terah takes Abram, Sarai and Lot and sets out for Canaan",
        labelFr: "Térach prend Abram, Saraï et Lot et part pour Canaan",
        refs: [{ usfm: "GEN", ref: "11:31" }],
      },
      {
        id: "ur-nehemiah",
        period: "exileReturn",
        weight: "reference",
        labelEn: "The returned exiles confess that God chose Abram and brought him out of it",
        labelFr:
          "Les exilés de retour confessent que Dieu a choisi Abram et l'en a fait sortir",
        refs: [{ usfm: "NEH", ref: "9:7" }],
      },
    ],
  },
  {
    id: "haran",
    nameEn: "Haran",
    nameFr: "Charan",
    lng: 39.032778,
    lat: 36.864444,
    tier: "notable",
    region: "mesopotamia",
    blurbEn:
      "A trading town on the Balikh where Abraham's family paused for years, and from which he finally left his father's house.",
    blurbFr:
      "Une ville caravanière sur le Balikh, où la famille d'Abraham s'arrêta des années, et d'où il quitta enfin la maison de son père.",
    source: {
      site: "Harran",
      confidence: 922,
      candidates: 1,
      slug: "haran",
    },
    events: [
      {
        id: "haran-terah-dies",
        period: "patriarchs",
        weight: "notable",
        labelEn: "Terah dies here, short of Canaan",
        labelFr: "Térach y meurt, avant d'atteindre Canaan",
        refs: [{ usfm: "GEN", ref: "11:31-32" }],
      },
      {
        id: "haran-call",
        period: "patriarchs",
        weight: "headline",
        labelEn: "The Lord tells Abram to leave his country, his kin and his father's house",
        labelFr:
          "L'Éternel dit à Abram de quitter son pays, sa parenté et la maison de son père",
        descriptionEn:
          "The call that began in Ur is restated here, now that Terah is dead and the family has put down roots. Abram goes, seventy-five years old, taking Sarai and Lot and the people they had gathered in Haran, and the narrative of the land starts from this departure.",
        descriptionFr:
          "L'appel commencé à Ur est repris ici, maintenant que Térach est mort et que la famille a pris racine. Abram part, à soixante-quinze ans, avec Saraï et Lot et les gens qu'ils avaient acquis à Charan, et le récit du pays commence à ce départ.",
        refs: [{ usfm: "GEN", ref: "12:1-5" }],
      },
      {
        id: "haran-rebekah",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Abraham's servant finds Rebekah at the well of the city",
        labelFr: "Le serviteur d'Abraham trouve Rebecca au puits de la ville",
        descriptionEn:
          "Sent back to the father's country for a wife, the servant prays at the well and is still speaking when Rebekah comes out. He tells the story in the house of Bethuel, and she agrees to go. Isaac is waiting in the Negev when the caravan comes home.",
        descriptionFr:
          "Renvoyé au pays du père pour y prendre une femme, le serviteur prie au puits et parle encore quand Rebecca sort. Il raconte l'histoire dans la maison de Bethuel, et elle consent à partir. Isaac attend dans le Néguev quand la caravane rentre.",
        refs: [{ usfm: "GEN", ref: "24:10-61" }],
      },
      {
        id: "haran-jacob",
        period: "patriarchs",
        weight: "headline",
        labelEn: "Jacob flees here, works fourteen years for Leah and Rachel, and becomes a people",
        labelFr:
          "Jacob s'y réfugie, travaille quatorze ans pour Léa et Rachel, et devient un peuple",
        descriptionEn:
          "Running from Esau, Jacob arrives with a staff and falls in with Laban. Twenty years later he leaves with four women, eleven sons, and flocks that have emptied his father-in-law's yards. Haran is where Israel is assembled before it ever sees the land.",
        descriptionFr:
          "Fuyant Ésaü, Jacob arrive avec un bâton et tombe sur Laban. Vingt ans plus tard, il part avec quatre femmes, onze fils, et des troupeaux qui ont vidé les parcs de son beau-père. Charan est le lieu où Israël se rassemble, avant même de voir le pays.",
        refs: [
          { usfm: "GEN", ref: "29:1-30" },
          { usfm: "GEN", ref: "31:1-21" },
        ],
      },
      {
        id: "haran-assyria",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "The king of Assyria has already taken it when the Rabshakeh boasts",
        labelFr:
          "Le roi d'Assyrie l'a déjà prise quand le Rabsaké se vante",
        refs: [{ usfm: "2KI", ref: "19:12" }],
      },
    ],
  },
];

export const ASIA_MINOR: City[] = [
  {
    id: "ephesus",
    nameEn: "Ephesus",
    nameFr: "Éphèse",
    lng: 27.3407,
    lat: 37.939125,
    tier: "notable",
    region: "asiaMinor",
    blurbEn:
      "The chief city of Roman Asia, home of Artemis and of the church Paul stayed with longer than any other, and the first of the seven churches of Revelation.",
    blurbFr:
      "La principale ville de l'Asie romaine, cité d'Artémis et de l'église auprès de laquelle Paul resta le plus longtemps, première des sept églises de l'Apocalypse.",
    source: {
      site: "Ephesus",
      confidence: 1000,
      candidates: 1,
      slug: "ephesus",
    },
    curated: true,
    events: [
      {
        id: "ephesus-brief",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Paul reasons in the synagogue and promises to return",
        labelFr: "Paul discute dans la synagogue et promet de revenir",
        refs: [{ usfm: "ACT", ref: "18:19-21" }],
      },
      {
        id: "ephesus-apollos",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Priscilla and Aquila take Apollos aside and explain the way more accurately",
        labelFr:
          "Priscille et Aquilas prennent Apollos à part et lui exposent plus exactement la voie",
        refs: [{ usfm: "ACT", ref: "18:24-28" }],
      },
      {
        id: "ephesus-two-years",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul stays more than two years, and the word spreads through Asia",
        labelFr:
          "Paul reste plus de deux ans, et la parole se répand dans toute l'Asie",
        descriptionEn:
          "After three months in the synagogue he rents the hall of Tyrannus and teaches daily. Luke says all the residents of Asia heard the word, Jews and Greeks, and that handkerchiefs carried from Paul healed the sick. The stay is the longest of any in Acts.",
        descriptionFr:
          "Après trois mois dans la synagogue, il loue la salle de Tyrannus et enseigne chaque jour. Luc dit que tous les habitants de l'Asie entendirent la parole, Juifs et Grecs, et que des mouchoirs emportés de chez Paul guérissaient les malades. C'est le plus long séjour des Actes.",
        refs: [{ usfm: "ACT", ref: "19:8-12" }],
      },
      {
        id: "ephesus-scrolls",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Believers burn their magic scrolls in public",
        labelFr: "Des croyants brûlent en public leurs livres de magie",
        refs: [{ usfm: "ACT", ref: "19:18-20" }],
      },
      {
        id: "ephesus-riot",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Demetrius fills the theatre, and for two hours they shout 'Great is Artemis'",
        labelFr:
          "Démétrius emplit le théâtre, et pendant deux heures on crie « Grande est Artémis »",
        descriptionEn:
          "A silversmith whose trade is miniature shrines of the goddess gathers the craftsmen and tells them their living and her majesty are both at risk. The city fills the theatre. Paul is kept out by his friends, and the town clerk has to argue the crowd down before a riot becomes a charge of sedition.",
        descriptionFr:
          "Un orfèvre dont le métier est de faire des temples portatifs de la déesse rassemble les artisans et leur dit que leur gagne-pain et sa majesté sont tous deux en danger. La ville emplit le théâtre. Paul est retenu dehors par ses amis, et le secrétaire de la ville doit calmer la foule avant qu'une émeute ne devienne accusation de sédition.",
        refs: [{ usfm: "ACT", ref: "19:23-41" }],
      },
      {
        id: "ephesus-elders",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Paul sends for the elders to Miletus and tells them he will not see them again",
        labelFr:
          "Paul convoque les anciens à Milet et leur dit qu'il ne les reverra plus",
        refs: [{ usfm: "ACT", ref: "20:17-38" }],
      },
      {
        id: "ephesus-revelation",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "The first of the seven letters: they have abandoned their first love",
        labelFr:
          "La première des sept lettres : ils ont abandonné leur premier amour",
        descriptionEn:
          "The risen Christ praises the church for testing false apostles and for enduring, then names the thing that is missing. If they do not repent he will come and remove their lampstand. The city that once burned its scrolls is told that orthodoxy without love is not enough.",
        descriptionFr:
          "Le Christ ressuscité loue l'église d'avoir éprouvé les faux apôtres et d'avoir tenu, puis nomme ce qui manque. S'ils ne se repentent pas, il viendra et ôtera leur chandelier. La ville qui avait brûlé ses livres s'entend dire que l'orthodoxie sans l'amour ne suffit pas.",
        refs: [{ usfm: "REV", ref: "2:1-7" }],
      },
    ],
  },
  {
    id: "tarsus",
    nameEn: "Tarsus",
    nameFr: "Tarse",
    lng: 34.892056,
    lat: 36.913028,
    tier: "minor",
    region: "asiaMinor",
    blurbEn:
      "A university city of Cilicia, and the place Paul names when he has to say who he is.",
    blurbFr:
      "Une ville universitaire de Cilicie, et le lieu que Paul nomme quand il doit dire qui il est.",
    source: {
      site: "Tarsus",
      confidence: 1000,
      candidates: 1,
      slug: "tarsus",
    },
    events: [
      {
        id: "tarsus-citizen",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul tells the tribune he is a Jew of Tarsus, a citizen of no obscure city",
        labelFr:
          "Paul dit au tribun qu'il est Juif de Tarse, citoyen d'une ville qui n'est pas sans renom",
        descriptionEn:
          "Arrested in the temple and about to be flogged, Paul uses the name of his birthplace twice: once to the soldiers, as a free city of Cilicia, and once in his defence speeches. The city is how a man from the provinces claims a hearing in Jerusalem and in Rome.",
        descriptionFr:
          "Arrêté dans le temple et sur le point d'être fouetté, Paul se sert deux fois du nom de sa ville natale : une fois devant les soldats, comme cité libre de Cilicie, et une fois dans ses apologies. La ville est la façon dont un homme des provinces se fait entendre à Jérusalem et à Rome.",
        refs: [
          { usfm: "ACT", ref: "21:39" },
          { usfm: "ACT", ref: "22:3" },
        ],
      },
      {
        id: "tarsus-sent-home",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "The Jerusalem church sends him home when the Hellenists plot to kill him",
        labelFr:
          "L'église de Jérusalem le renvoie chez lui quand les Hellénistes complotent de le tuer",
        refs: [{ usfm: "ACT", ref: "9:29-30" }],
      },
      {
        id: "tarsus-barnabas",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Barnabas comes here to find him and bring him to Antioch",
        labelFr: "Barnabas vient l'y chercher pour l'emmener à Antioche",
        descriptionEn:
          "Years after the road to Damascus, Saul is back in his own city and out of the story. Barnabas, needing a teacher for the Greeks in Antioch, remembers him, makes the journey, and fetches him. The mission to the Gentiles starts with that retrieval.",
        descriptionFr:
          "Des années après le chemin de Damas, Saul est de retour dans sa ville et hors du récit. Barnabas, qui a besoin d'un docteur pour les Grecs d'Antioche, se souvient de lui, fait le voyage et le ramène. La mission aux païens commence par cette recherche.",
        refs: [{ usfm: "ACT", ref: "11:25-26" }],
      },
    ],
  },
  {
    id: "antioch-pisidia",
    nameEn: "Pisidian Antioch",
    nameFr: "Antioche de Pisidie",
    lng: 31.189167,
    lat: 38.306111,
    tier: "minor",
    region: "asiaMinor",
    blurbEn:
      "A Roman colony in the Anatolian highlands where Paul preached his first recorded synagogue sermon, and from which he was expelled.",
    blurbFr:
      "Une colonie romaine des hauts plateaux d'Anatolie, où Paul prononça son premier sermon de synagogue dont on ait le texte, et d'où il fut chassé.",
    source: {
      site: "Antioch in Pisidia",
      confidence: 1000,
      candidates: 1,
      slug: "antioch-2",
    },
    events: [
      {
        id: "antioch-pisidia-sermon",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul is invited to speak after the reading, and walks the congregation from Egypt to Jesus",
        labelFr:
          "Paul est invité à parler après la lecture, et conduit l'assemblée de l'Égypte jusqu'à Jésus",
        descriptionEn:
          "On the first sabbath they sit in the synagogue; on the second, nearly the whole city gathers. Paul recounts the election of Israel, the promise to David, and the raising of Jesus, then tells them that forgiveness is being proclaimed through this man. Luke gives the speech in full: it is the template for every later synagogue address.",
        descriptionFr:
          "Le premier sabbat, ils s'asseyent dans la synagogue ; le second, presque toute la ville s'assemble. Paul raconte l'élection d'Israël, la promesse à David et la résurrection de Jésus, puis dit que le pardon est annoncé par cet homme. Luc donne le discours en entier : c'est le modèle de toutes les allocutions suivantes en synagogue.",
        refs: [{ usfm: "ACT", ref: "13:14-41" }],
      },
      {
        id: "antioch-pisidia-expelled",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Jealousy turns the city, and they are driven out",
        labelFr: "La jalousie retourne la ville, et on les chasse",
        descriptionEn:
          "When the Gentiles beg to hear the same words the next sabbath, the synagogue fills with the whole city and the Jews contradict Paul. He and Barnabas turn to the Gentiles, the word spreads through the region, and the leading men and women of the city have them expelled. They shake the dust off and go on to Iconium.",
        descriptionFr:
          "Quand les païens demandent à entendre les mêmes paroles le sabbat suivant, la synagogue se remplit de toute la ville et les Juifs contredisent Paul. Lui et Barnabas se tournent vers les païens, la parole se répand dans la région, et les notables de la ville les font expulser. Ils secouent la poussière et passent à Iconium.",
        refs: [{ usfm: "ACT", ref: "13:42-52" }],
      },
      {
        id: "antioch-pisidia-return",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "They come back through it to appoint elders in the new church",
        labelFr:
          "Ils y repassent pour établir des anciens dans la nouvelle église",
        refs: [{ usfm: "ACT", ref: "14:21-23" }],
      },
    ],
  },
  {
    id: "lystra",
    nameEn: "Lystra",
    nameFr: "Lystre",
    lng: 32.3384,
    lat: 37.6017,
    tier: "minor",
    region: "asiaMinor",
    blurbEn:
      "A small Lycaonian town that first tried to sacrifice to Paul and Barnabas, then stoned Paul and left him for dead, and later gave him Timothy.",
    blurbFr:
      "Une petite ville de Lycaonie qui tenta d'abord d'offrir un sacrifice à Paul et Barnabas, puis lapida Paul et le laissa pour mort, et lui donna plus tard Timothée.",
    source: {
      site: "Tel Lystra",
      confidence: 1000,
      candidates: 1,
      slug: "lystra",
    },
    events: [
      {
        id: "lystra-gods",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "A lame man walks, and the crowd names them Hermes and Zeus",
        labelFr: "Un boiteux marche, et la foule les nomme Hermès et Zeus",
        descriptionEn:
          "Paul sees that a man lame from birth has faith to be healed and tells him to stand. The Lycaonian crowd decides the gods have come down, the priest of Zeus brings oxen, and Barnabas and Paul tear their clothes trying to stop the sacrifice. They barely prevent it.",
        descriptionFr:
          "Paul voit qu'un homme boiteux de naissance a la foi pour être guéri et lui dit de se lever. La foule lycaonienne décide que les dieux sont descendus, le prêtre de Zeus amène des bœufs, et Barnabas et Paul déchirent leurs vêtements pour empêcher le sacrifice. Ils n'y parviennent qu'à grand-peine.",
        refs: [{ usfm: "ACT", ref: "14:8-18" }],
      },
      {
        id: "lystra-stoned",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "The same crowd stones Paul and drags him out of the city",
        labelFr: "La même foule lapide Paul et le traîne hors de la ville",
        descriptionEn:
          "Jews from Antioch and Iconium arrive and turn the people. Paul is stoned, dragged outside, and left. The disciples stand around what they take to be a body; he gets up and walks back into the town, and the next day he goes on to Derbe.",
        descriptionFr:
          "Des Juifs d'Antioche et d'Iconium arrivent et retournent le peuple. Paul est lapidé, traîné dehors et laissé là. Les disciples entourent ce qu'ils prennent pour un corps ; il se lève, rentre dans la ville, et le lendemain il continue vers Derbe.",
        refs: [{ usfm: "ACT", ref: "14:19-20" }],
      },
      {
        id: "lystra-timothy",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "On the second journey Paul finds Timothy here and takes him along",
        labelFr:
          "Au second voyage, Paul y trouve Timothée et l'emmène",
        refs: [{ usfm: "ACT", ref: "16:1-3" }],
      },
    ],
  },
  {
    id: "troas",
    nameEn: "Troas",
    nameFr: "Troas",
    lng: 26.158611,
    lat: 39.751944,
    tier: "minor",
    region: "asiaMinor",
    blurbEn:
      "The Aegean port where Asia ends and Europe begins, and where Paul twice received a reason to cross.",
    blurbFr:
      "Le port égéen où l'Asie s'achève et où l'Europe commence, et où Paul reçut deux fois une raison de traverser.",
    source: {
      site: "Alexandria Troas",
      confidence: 1000,
      candidates: 1,
      slug: "troas",
    },
    events: [
      {
        id: "troas-vision",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "A man of Macedonia appears in the night and says come over",
        labelFr: "Un Macédonien apparaît de nuit et dit de passer",
        descriptionEn:
          "The Spirit has blocked every inland road. In the night at Troas Paul sees a man standing and begging him to cross to Macedonia. They conclude that God has called them, and the next harbour is Philippi. The gospel enters Europe from this quay.",
        descriptionFr:
          "L'Esprit a fermé toutes les routes de l'intérieur. De nuit, à Troas, Paul voit un homme debout qui le supplie de passer en Macédoine. Ils en concluent que Dieu les a appelés, et le port suivant est Philippes. L'Évangile entre en Europe depuis ce quai.",
        refs: [{ usfm: "ACT", ref: "16:8-10" }],
      },
      {
        id: "troas-eutychus",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Eutychus falls from the third-storey window during a long sermon",
        labelFr:
          "Eutychus tombe de la fenêtre du troisième étage pendant un long discours",
        descriptionEn:
          "On the last night before sailing, the room is hot and the lamps are many and Paul talks until midnight. A young man sinks into sleep and falls. Paul goes down, takes him up alive, and goes back upstairs to break bread and talk until dawn.",
        descriptionFr:
          "La dernière nuit avant de prendre la mer, la salle est chaude, les lampes nombreuses, et Paul parle jusqu'à minuit. Un jeune homme s'endort et tombe. Paul descend, le prend vivant, et remonte rompre le pain et parler jusqu'à l'aube.",
        refs: [{ usfm: "ACT", ref: "20:7-12" }],
      },
      {
        id: "troas-cloak",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Paul later asks Timothy to bring the cloak he left with Carpus here",
        labelFr:
          "Paul demande plus tard à Timothée d'apporter le manteau laissé chez Carpus ici",
        refs: [{ usfm: "2TI", ref: "4:13" }],
      },
    ],
  },
];

export const GREECE_ROME: City[] = [
  {
    id: "rome",
    nameEn: "Rome",
    nameFr: "Rome",
    lng: 12.4852,
    lat: 41.8922,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "The capital of the empire, already home to believers before Paul arrived, and the city he reached in chains and did not leave.",
    blurbFr:
      "La capitale de l'empire, qui comptait déjà des croyants avant l'arrivée de Paul, et la ville qu'il atteignit enchaîné et qu'il ne quitta plus.",
    source: {
      site: "Rome",
      confidence: 1000,
      candidates: 1,
      slug: "rome",
    },
    curated: true,
    events: [
      {
        id: "rome-pentecost",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Visitors from Rome are in the crowd at Pentecost",
        labelFr: "Des visiteurs venus de Rome sont dans la foule à la Pentecôte",
        refs: [{ usfm: "ACT", ref: "2:10" }],
      },
      {
        id: "rome-letter",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul writes to a church he has not yet seen, longing to come",
        labelFr:
          "Paul écrit à une église qu'il n'a pas encore vue, désirant ardemment y venir",
        descriptionEn:
          "The letter assumes a mixed congregation of Jews and Gentiles already meeting in the capital, and spends sixteen chapters arguing that the gospel is the power of God for both. He says he has often intended to come, and asks them to help him on the way to Spain. He will arrive by a route he did not choose.",
        descriptionFr:
          "La lettre suppose une assemblée mixte de Juifs et de païens déjà réunie dans la capitale, et passe seize chapitres à soutenir que l'Évangile est puissance de Dieu pour les deux. Il dit avoir souvent formé le projet d'y venir, et leur demande de l'aider à gagner l'Espagne. Il arrivera par un chemin qu'il n'avait pas choisi.",
        refs: [{ usfm: "ROM", ref: "1:7-15" }],
      },
      {
        id: "rome-arrival",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Believers walk out to the Forum of Appius to meet the prisoner",
        labelFr:
          "Des croyants marchent jusqu'au Forum d'Appius pour rencontrer le prisonnier",
        descriptionEn:
          "After the shipwreck Paul is walked up the Appian Way under guard. Brothers from the city come as far as the Three Taverns, and Luke says he thanked God and took courage. He is allowed to live by himself with a soldier, and for two years he receives all who come.",
        descriptionFr:
          "Après le naufrage, Paul est conduit par la voie Appienne sous escorte. Des frères de la ville viennent jusqu'aux Trois Tavernes, et Luc dit qu'il rendit grâces à Dieu et reprit courage. Il lui est permis de loger à part avec un soldat, et pendant deux ans il reçoit tous ceux qui viennent.",
        refs: [{ usfm: "ACT", ref: "28:14-31" }],
      },
      {
        id: "rome-jews",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "He calls the local Jewish leaders and spends a day arguing from Moses and the prophets",
        labelFr:
          "Il convoque les principaux Juifs de la ville et passe un jour à argumenter depuis Moïse et les prophètes",
        refs: [{ usfm: "ACT", ref: "28:17-28" }],
      },
      {
        id: "rome-onesiphorus",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Onesiphorus searches the city until he finds Paul in prison",
        labelFr:
          "Onésiphore parcourt la ville jusqu'à ce qu'il trouve Paul en prison",
        refs: [{ usfm: "2TI", ref: "1:16-17" }],
      },
    ],
  },
  {
    id: "corinth",
    nameEn: "Corinth",
    nameFr: "Corinthe",
    lng: 22.878741,
    lat: 37.905785,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "A commercial crossroads on the isthmus, where Paul stayed eighteen months and to which he later had to write the hardest of his letters.",
    blurbFr:
      "Un carrefour commercial sur l'isthme, où Paul resta dix-huit mois et auquel il dut plus tard écrire les plus dures de ses lettres.",
    source: {
      site: "Corinth",
      confidence: 1000,
      candidates: 1,
      slug: "corinth",
    },
    curated: true,
    events: [
      {
        id: "corinth-aquila",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Paul meets Aquila and Priscilla, fresh from Claudius's expulsion of the Jews",
        labelFr:
          "Paul rencontre Aquilas et Priscille, tout juste chassés de Rome par Claude",
        refs: [{ usfm: "ACT", ref: "18:1-3" }],
      },
      {
        id: "corinth-eighteen-months",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "The Lord tells him in the night not to be afraid: he has many people in this city",
        labelFr:
          "Le Seigneur lui dit de nuit de ne pas craindre : il a un peuple nombreux dans cette ville",
        descriptionEn:
          "Opposition in the synagogue is sharp enough that Paul shakes out his clothes and moves next door, into the house of Titius Justus. Then the synagogue ruler himself believes. A vision holds Paul there a year and a half, the longest settled stay of the second journey.",
        descriptionFr:
          "L'opposition dans la synagogue est assez vive pour que Paul secoue ses vêtements et s'installe à côté, chez Titius Justus. Puis le chef de la synagogue lui-même croit. Une vision retient Paul un an et demi, le plus long séjour fixe du second voyage.",
        refs: [{ usfm: "ACT", ref: "18:5-11" }],
      },
      {
        id: "corinth-gallio",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Gallio refuses to hear a religious charge, and the crowd beats Sosthenes instead",
        labelFr:
          "Gallion refuse d'entendre une accusation religieuse, et la foule frappe Sosthène à sa place",
        descriptionEn:
          "The Jews haul Paul before the proconsul of Achaia. Gallio rules that a dispute about names and a Jewish law is not a Roman matter, and drives them from the tribunal. The city's Greeks then beat the synagogue ruler in front of the bench, and Gallio looks the other way.",
        descriptionFr:
          "Les Juifs traînent Paul devant le proconsul d'Achaïe. Gallion juge qu'un différend sur des noms et une loi juive n'est pas une affaire romaine, et les chasse du tribunal. Les Grecs de la ville frappent alors le chef de la synagogue devant le siège, et Gallion n'en a cure.",
        refs: [{ usfm: "ACT", ref: "18:12-17" }],
      },
      {
        id: "corinth-letters",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "From Ephesus Paul writes into the factions, the lawsuits and the table",
        labelFr:
          "Depuis Éphèse, Paul écrit contre les partis, les procès et les désordres de la table",
        refs: [
          { usfm: "1CO", ref: "1:10-17" },
          { usfm: "1CO", ref: "6:1-8" },
          { usfm: "1CO", ref: "11:20-34" },
        ],
      },
      {
        id: "corinth-return",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "He spends three months here on the third journey, then changes his route",
        labelFr:
          "Il y passe trois mois au troisième voyage, puis change d'itinéraire",
        refs: [{ usfm: "ACT", ref: "20:2-3" }],
      },
    ],
  },
  {
    id: "athens",
    nameEn: "Athens",
    nameFr: "Athènes",
    lng: 23.726738,
    lat: 37.971851,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "The city of philosophers, where Paul walked among idols until he was taken to the Areopagus to explain the unknown God.",
    blurbFr:
      "La ville des philosophes, où Paul marcha parmi les idoles jusqu'à ce qu'on le mène à l'Aréopage pour qu'il explique le Dieu inconnu.",
    source: {
      site: "Athens",
      confidence: 1000,
      candidates: 1,
      slug: "athens",
    },
    events: [
      {
        id: "athens-distressed",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "He waits for Silas and Timothy, and the city full of idols wears on him",
        labelFr:
          "Il attend Silas et Timothée, et la ville pleine d'idoles le tourmente",
        refs: [{ usfm: "ACT", ref: "17:16-17" }],
      },
      {
        id: "athens-areopagus",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "On the Areopagus he names the unknown God and the man God has raised",
        labelFr:
          "À l'Aréopage, il nomme le Dieu inconnu et l'homme que Dieu a ressuscité",
        descriptionEn:
          "Epicureans and Stoics take him for a babbler and walk him to the hill where new gods are examined. He starts from an altar he has seen, moves through creation and the one blood of all nations, and ends at a resurrection. When they hear that word, some mock, some delay, and a few believe, including Dionysius the Areopagite.",
        descriptionFr:
          "Épicuriens et stoïciens le prennent pour un discoureur et le mènent à la colline où l'on examine les dieux nouveaux. Il part d'un autel qu'il a vu, traverse la création et le sang unique de toutes les nations, et s'achève sur une résurrection. À ce mot, les uns se moquent, d'autres temporisent, et quelques-uns croient, dont Denys l'Aréopagite.",
        refs: [{ usfm: "ACT", ref: "17:18-34" }],
      },
      {
        id: "athens-left-alone",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Timothy is later sent back, and Paul is left in Athens alone",
        labelFr:
          "Timothée est plus tard renvoyé, et Paul reste seul à Athènes",
        refs: [{ usfm: "1TH", ref: "3:1-2" }],
      },
    ],
  },
  {
    id: "philippi",
    nameEn: "Philippi",
    nameFr: "Philippes",
    lng: 24.284576,
    lat: 41.012072,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "A Roman colony on the Via Egnatia, the first European city to hear Paul, and the church he later called his joy and crown.",
    blurbFr:
      "Une colonie romaine sur la voie Egnatia, la première ville d'Europe à entendre Paul, et l'église dont il dit plus tard qu'elle était sa joie et sa couronne.",
    source: {
      site: "Philippi",
      confidence: 1000,
      candidates: 1,
      slug: "philippi",
    },
    events: [
      {
        id: "philippi-lydia",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "On the sabbath they sit down by the river, and Lydia's heart is opened",
        labelFr:
          "Le sabbat, ils s'asseyent au bord de la rivière, et le cœur de Lydie s'ouvre",
        descriptionEn:
          "There is no synagogue, only a place of prayer outside the gate. A dealer in purple from Thyatira listens, believes, and is baptised with her household. She then insists that the missionaries stay in her house. The first convert in Europe is a businesswoman who will not take no.",
        descriptionFr:
          "Il n'y a pas de synagogue, seulement un lieu de prière hors de la porte. Une marchande de pourpre de Thyatire écoute, croit, et est baptisée avec sa maison. Elle insiste ensuite pour que les missionnaires logent chez elle. La première convertie d'Europe est une femme d'affaires qui n'accepte pas un refus.",
        refs: [{ usfm: "ACT", ref: "16:12-15" }],
      },
      {
        id: "philippi-prison",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Beaten and locked in the inner prison, they sing, and the doors open",
        labelFr:
          "Battus et enfermés au fond de la prison, ils chantent, et les portes s'ouvrent",
        descriptionEn:
          "A slave girl with a spirit of divination follows them for days. Paul sends the spirit out; her owners drag them before the magistrates; they are flogged and put in stocks. At midnight an earthquake opens every door. The jailer is about to kill himself when Paul calls from the dark that they are all still there.",
        descriptionFr:
          "Une esclave à l'esprit de divination les suit pendant des jours. Paul chasse l'esprit ; ses maîtres les traînent devant les magistrats ; on les fouette et on les met dans les ceps. À minuit, un séisme ouvre toutes les portes. Le geôlier va se tuer quand Paul crie dans le noir qu'ils sont encore tous là.",
        refs: [{ usfm: "ACT", ref: "16:16-34" }],
      },
      {
        id: "philippi-citizenship",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "In the morning Paul makes the magistrates come and lead them out",
        labelFr:
          "Le matin, Paul oblige les magistrats à venir eux-mêmes les faire sortir",
        refs: [{ usfm: "ACT", ref: "16:35-40" }],
      },
    ],
  },
  {
    id: "thessalonica",
    nameEn: "Thessalonica",
    nameFr: "Thessalonique",
    lng: 22.945767,
    lat: 40.637771,
    tier: "notable",
    region: "greeceRome",
    blurbEn:
      "The free city and capital of Macedonia, on the Via Egnatia, where Paul lasted three sabbaths and then wrote the earliest letters we still have.",
    blurbFr:
      "Cité libre et capitale de Macédoine, sur la voie Egnatia, où Paul tint trois sabbats, puis écrivit les plus anciennes lettres qui nous restent.",
    source: {
      site: "Thessaloniki",
      confidence: 1000,
      candidates: 1,
      slug: "thessalonica",
    },
    curated: true,
    events: [
      {
        id: "thessalonica-synagogue",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul reasons for three sabbaths, and a mob attacks Jason's house",
        labelFr:
          "Paul discute trois sabbats, et une foule attaque la maison de Jason",
        descriptionEn:
          "He opens the scriptures to show that the Messiah had to suffer and rise, and that this Jesus is that Messiah. Some Jews believe, and a great many God-fearing Greeks. The city is then dragged before the politarchs on the charge that these men have turned the world upside down and are saying there is another king.",
        descriptionFr:
          "Il ouvre les Écritures pour montrer que le Messie devait souffrir et ressusciter, et que ce Jésus est ce Messie. Quelques Juifs croient, et un grand nombre de Grecs craignant Dieu. On traîne alors la ville devant les politarques, sous l'accusation que ces gens ont bouleversé le monde et disent qu'il y a un autre roi.",
        refs: [{ usfm: "ACT", ref: "17:1-9" }],
      },
      {
        id: "thessalonica-pursuit",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Jews from here follow Paul to Berea and stir the crowds again",
        labelFr:
          "Des Juifs d'ici suivent Paul à Bérée et soulèvent de nouveau les foules",
        refs: [{ usfm: "ACT", ref: "17:13" }],
      },
      {
        id: "thessalonica-first-letter",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "From Corinth he writes to a church that received the word in affliction",
        labelFr:
          "Depuis Corinthe, il écrit à une église qui a reçu la parole dans la tribulation",
        descriptionEn:
          "The letter is almost certainly the oldest Christian document we have. Paul reminds them he worked night and day so as not to be a burden, and that they became an example to Macedonia and Achaia. He writes because he could not bear not knowing whether they had stood.",
        descriptionFr:
          "Cette lettre est presque certainement le plus ancien document chrétien que nous ayons. Paul rappelle qu'il a travaillé nuit et jour pour n'être à charge à personne, et qu'ils sont devenus un modèle pour la Macédoine et l'Achaïe. Il écrit parce qu'il ne pouvait supporter de ne pas savoir s'ils avaient tenu.",
        refs: [
          { usfm: "1TH", ref: "1:6-8" },
          { usfm: "1TH", ref: "2:9" },
        ],
      },
      {
        id: "thessalonica-idle",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "A second letter tells those waiting for the day to go back to work",
        labelFr:
          "Une seconde lettre dit à ceux qui attendent le jour de se remettre au travail",
        refs: [{ usfm: "2TH", ref: "3:6-12" }],
      },
      {
        id: "thessalonica-support",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "The Philippians send him help here more than once",
        labelFr: "Les Philippiens lui envoient ici des secours plus d'une fois",
        refs: [{ usfm: "PHP", ref: "4:15-16" }],
      },
      {
        id: "thessalonica-aristarchus",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Aristarchus, a Macedonian of this city, travels with Paul as far as Rome",
        labelFr:
          "Aristarque, Macédonien de cette ville, voyage avec Paul jusqu'à Rome",
        refs: [
          { usfm: "ACT", ref: "20:4" },
          { usfm: "ACT", ref: "27:2" },
        ],
      },
    ],
  },
  {
    id: "berea",
    nameEn: "Berea",
    nameFr: "Bérée",
    lng: 22.2,
    lat: 40.518333,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "A Macedonian city off the main road, remembered for a synagogue that checked Paul's preaching against the text itself.",
    blurbFr:
      "Une ville de Macédoine à l'écart de la grande route, dont on se souvient pour une synagogue qui vérifiait la prédication de Paul sur le texte lui-même.",
    source: {
      site: "Veria",
      confidence: 1000,
      candidates: 1,
      slug: "berea",
    },
    events: [
      {
        id: "berea-examine",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "They receive the word and examine the scriptures every day to see if it is so",
        labelFr:
          "Ils reçoivent la parole et examinent chaque jour les Écritures pour voir s'il en est ainsi",
        descriptionEn:
          "Luke sets them against the synagogue in Thessalonica: more noble, because they listen and then look it up. Many of them believe, with Greek women of standing and not a few men. The compliment is not that they were credulous. It is that they were willing to be shown.",
        descriptionFr:
          "Luc les oppose à la synagogue de Thessalonique : plus nobles, parce qu'ils écoutent puis vérifient. Beaucoup d'entre eux croient, avec des femmes grecques de qualité et un certain nombre d'hommes. Le compliment n'est pas qu'ils aient été crédules. C'est qu'ils aient accepté qu'on leur montre.",
        refs: [{ usfm: "ACT", ref: "17:10-12" }],
      },
      {
        id: "berea-sent-on",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Agitators arrive from Thessalonica, and the brothers send Paul to the sea",
        labelFr:
          "Des agitateurs arrivent de Thessalonique, et les frères font conduire Paul vers la mer",
        refs: [{ usfm: "ACT", ref: "17:13-15" }],
      },
      {
        id: "berea-sopater",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Sopater son of Pyrrhus, of this city, is in the party that goes up to Jerusalem",
        labelFr:
          "Sopatros, fils de Pyrrhus, de cette ville, est du groupe qui monte à Jérusalem",
        refs: [{ usfm: "ACT", ref: "20:4" }],
      },
    ],
  },
  {
    id: "cenchreae",
    nameEn: "Cenchreae",
    nameFr: "Cenchrees",
    lng: 22.996816,
    lat: 37.884335,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "Corinth's eastern harbour on the Saronic Gulf, the port you used if you were sailing for Asia, and home to a church of its own.",
    blurbFr:
      "Le port oriental de Corinthe sur le golfe Saronique, celui qu'on prenait pour l'Asie, et le siège d'une église à part entière.",
    source: {
      site: "Kechries",
      confidence: 1000,
      candidates: 1,
      slug: "cenchreae",
    },
    events: [
      {
        id: "cenchreae-vow",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul cuts his hair here because of a vow, then sails for Syria",
        labelFr:
          "Paul s'y coupe les cheveux à cause d'un vœu, puis s'embarque pour la Syrie",
        descriptionEn:
          "At the end of eighteen months in Corinth he leaves from this harbour, not the western one. Luke notes the vow in a clause and moves on, which is how most of the church's ordinary piety gets into Acts: in passing, on the way to a ship.",
        descriptionFr:
          "Au terme de dix-huit mois à Corinthe, il part de ce port, non de celui de l'ouest. Luc note le vœu d'une incise et passe, ce qui est la façon dont la piété ordinaire de l'Église entre dans les Actes : en passant, en route vers un navire.",
        refs: [{ usfm: "ACT", ref: "18:18" }],
      },
      {
        id: "cenchreae-phoebe",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Phoebe, a deacon of the church here, carries the letter to Rome",
        labelFr:
          "Phoebé, diacre de l'église d'ici, porte la lettre à Rome",
        descriptionEn:
          "Paul commends her to the Romans as a patron of many, including himself, and asks them to help her in whatever she needs. If she is carrying the letter, then the most argued-over document in the New Testament travelled in the baggage of a woman from this harbour.",
        descriptionFr:
          "Paul la recommande aux Romains comme une protectrice de beaucoup, lui compris, et leur demande de l'assister en ce dont elle aura besoin. Si c'est elle qui porte la lettre, alors le document le plus discuté du Nouveau Testament a voyagé dans les bagages d'une femme de ce port.",
        refs: [{ usfm: "ROM", ref: "16:1-2" }],
      },
    ],
  },
  {
    id: "neapolis",
    nameEn: "Neapolis",
    nameFr: "Néapolis",
    lng: 24.415,
    lat: 40.935,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "The Aegean harbour of Philippi, where the Macedonian party first set foot in Europe.",
    blurbFr:
      "Le port égéen de Philippes, où le groupe venu de Macédoine prit terre pour la première fois en Europe.",
    source: {
      site: "Kavala",
      confidence: 1000,
      candidates: 1,
      slug: "neapolis",
    },
    events: [
      {
        id: "neapolis-landing",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "They land here from Troas and walk the Via Egnatia up to Philippi",
        labelFr:
          "Ils y débarquent depuis Troas et montent à Philippes par la voie Egnatia",
        descriptionEn:
          "The crossing from Troas takes them by Samothrace and into this harbour. Luke starts using 'we' on this stretch: he is on the boat. From the quay it is a day's walk inland to the colony where Lydia will be waiting by the river.",
        descriptionFr:
          "La traversée depuis Troas les mène par Samothrace jusqu'à ce port. Luc se met à dire « nous » sur ce trajet : il est sur le bateau. Du quai, il y a une journée de marche jusqu'à la colonie où Lydie attendra au bord de la rivière.",
        refs: [{ usfm: "ACT", ref: "16:11-12" }],
      },
    ],
  },
  {
    id: "nicopolis",
    nameEn: "Nicopolis",
    nameFr: "Nicopolis",
    lng: 20.73736,
    lat: 39.023485,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "Augustus's victory city on the Ambracian Gulf, where Paul planned to winter and asked Titus to meet him.",
    blurbFr:
      "La ville de la victoire d'Auguste sur le golfe d'Ambracie, où Paul projetait d'hiverner et demandait à Tite de le rejoindre.",
    source: {
      site: "Nicopolis",
      confidence: 1000,
      candidates: 1,
      slug: "nicopolis",
    },
    events: [
      {
        id: "nicopolis-winter",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul tells Titus to join him here, because he has decided to winter in the city",
        labelFr:
          "Paul dit à Tite de le rejoindre ici, parce qu'il a décidé d'y passer l'hiver",
        descriptionEn:
          "The letter to Titus is sent ahead to Crete with that instruction. Nicopolis was built to commemorate Actium, a city that existed to say Rome had won. Paul choosing it as a winter base means the mission has reached the Adriatic shore of Greece, facing Italy.",
        descriptionFr:
          "La lettre à Tite part pour la Crète avec cette instruction. Nicopolis avait été bâtie pour commémorer Actium, une ville dont l'existence disait que Rome avait gagné. Que Paul la choisisse pour l'hiver veut dire que la mission a atteint la rive adriatique de la Grèce, face à l'Italie.",
        refs: [{ usfm: "TIT", ref: "3:12" }],
      },
    ],
  },
  {
    id: "syracuse",
    nameEn: "Syracuse",
    nameFr: "Syracuse",
    lng: 15.293056,
    lat: 37.063889,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "The old capital of Greek Sicily, still one of the great cities of the western Mediterranean when Paul's grain ship put in for three days.",
    blurbFr:
      "L'ancienne capitale de la Sicile grecque, encore l'une des grandes villes de la Méditerranée occidentale lorsque le navire à blé de Paul y relâcha trois jours.",
    source: {
      site: "Syracuse",
      confidence: 1000,
      candidates: 1,
      slug: "syracuse",
    },
    events: [
      {
        id: "syracuse-three-days",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "The Alexandrian ship puts in for three days on the way to Italy",
        labelFr:
          "Le navire d'Alexandrie y relâche trois jours sur le chemin de l'Italie",
        descriptionEn:
          "After the winter on Malta they take a ship whose figurehead is the Twin Brothers and work north along Sicily. Luke gives Syracuse a single clause — three days — which is all Acts ever says about the city that once held off Athens and Carthage. The empire's grain route does not linger.",
        descriptionFr:
          "Après l'hiver à Malte, ils prennent un navire dont la figure de proue est les Dioscures et remontent la Sicile. Luc accorde à Syracuse une seule incise — trois jours — ce qui est tout ce que les Actes disent de la ville qui tint tête à Athènes et à Carthage. La route du blé de l'empire ne s'attarde pas.",
        refs: [{ usfm: "ACT", ref: "28:12" }],
      },
    ],
  },
  {
    id: "puteoli",
    nameEn: "Puteoli",
    nameFr: "Pouzoles",
    lng: 14.120556,
    lat: 40.826111,
    tier: "minor",
    region: "greeceRome",
    blurbEn:
      "Italy's busiest commercial harbour in the first century, where the grain fleets from Egypt docked and where Paul found believers already waiting.",
    blurbFr:
      "Le port de commerce le plus actif d'Italie au Ier siècle, où accostaient les flottes de blé d'Égypte et où Paul trouva déjà des croyants.",
    source: {
      site: "Pozzuoli",
      confidence: 1000,
      candidates: 1,
      slug: "puteoli",
    },
    events: [
      {
        id: "puteoli-brothers",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "They find brothers here and are asked to stay seven days",
        labelFr:
          "Ils y trouvent des frères et sont priés de rester sept jours",
        descriptionEn:
          "From Syracuse they tack to Rhegium, catch a south wind, and make Puteoli in two days. The harbour is where Egypt's grain came ashore for Rome. Paul, still a prisoner, is allowed to stay a week with the local church before the walk up the Appian Way. The gospel has reached Italy ahead of the apostle.",
        descriptionFr:
          "De Syracuse ils bordent jusqu'à Rhegium, prennent un vent du sud et gagnent Pouzoles en deux jours. C'est le port où le blé d'Égypte débarquait pour Rome. Paul, toujours prisonnier, est autorisé à rester une semaine avec l'église locale avant la marche sur la voie Appienne. L'Évangile a précédé l'apôtre en Italie.",
        refs: [{ usfm: "ACT", ref: "28:13-14" }],
      },
    ],
  },
];
