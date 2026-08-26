import type { City } from "./citiesData";

export const GALILEE: City[] = [
  {
    id: "capernaum",
    nameEn: "Capernaum",
    nameFr: "Capernaüm",
    lng: 35.575,
    lat: 32.881111,
    tier: "notable",
    region: "galilee",
    blurbEn:
      "A fishing town on the north shore of the lake that Jesus made his base once Nazareth had rejected him.",
    blurbFr:
      "Une ville de pêcheurs sur la rive nord du lac, dont Jésus fit sa base une fois Nazareth l'ayant rejeté.",
    source: {
      site: "Tell Hum",
      confidence: 842,
      candidates: 2,
      slug: "capernaum",
    },
    curated: true,
    events: [
      {
        id: "capernaum-settles",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus leaves Nazareth and makes this his own city",
        labelFr: "Jésus quitte Nazareth et fait de cette ville la sienne",
        descriptionEn:
          "Matthew says he settled here after John's arrest, in the territory of Zebulun and Naphtali, which the gospel reads as Isaiah's 'people who sat in darkness'. From this shore he calls the first disciples and begins to teach.",
        descriptionFr:
          "Matthieu dit qu'il s'y établit après l'arrestation de Jean, dans le territoire de Zabulon et de Nephthali, ce que l'évangile lit comme le « peuple assis dans les ténèbres » d'Ésaïe. C'est de cette rive qu'il appelle les premiers disciples et commence à enseigner.",
        refs: [{ usfm: "MAT", ref: "4:13-22" }],
      },
      {
        id: "capernaum-paralytic",
        period: "gospels",
        weight: "headline",
        labelEn: "Friends lower a paralysed man through the roof",
        labelFr: "Des amis descendent un paralytique par le toit",
        descriptionEn:
          "The house is so crowded they take the roof off. Jesus first forgives the man's sins, which the scribes treat as blasphemy, and then tells him to pick up his mat and walk, so that they can see the two acts as one authority.",
        descriptionFr:
          "La maison est si pleine qu'ils découvrent le toit. Jésus pardonne d'abord les péchés de l'homme, ce que les scribes tiennent pour un blasphème, puis lui dit de prendre son lit et de marcher, afin qu'ils voient les deux actes comme une seule autorité.",
        refs: [{ usfm: "MRK", ref: "2:1-12" }],
      },
      {
        id: "capernaum-centurion",
        period: "gospels",
        weight: "notable",
        labelEn: "A Roman centurion asks for a word, not a visit",
        labelFr: "Un centurion romain demande une parole, non une visite",
        refs: [{ usfm: "MAT", ref: "8:5-13" }],
      },
      {
        id: "capernaum-peters-mother",
        period: "gospels",
        weight: "reference",
        labelEn: "He heals Peter's mother-in-law in her house",
        labelFr: "Il guérit la belle-mère de Pierre dans sa maison",
        refs: [{ usfm: "MRK", ref: "1:29-31" }],
      },
      {
        id: "capernaum-synagogue",
        period: "gospels",
        weight: "notable",
        labelEn: "He teaches in the synagogue and a man with an unclean spirit cries out",
        labelFr:
          "Il enseigne dans la synagogue et un homme à l'esprit impur s'écrie",
        refs: [{ usfm: "MRK", ref: "1:21-28" }],
      },
      {
        id: "capernaum-bread",
        period: "gospels",
        weight: "headline",
        labelEn: "The crowd wants bread again, and many disciples leave",
        labelFr: "La foule veut encore du pain, et beaucoup de disciples s'en vont",
        descriptionEn:
          "The day after the feeding, people follow him back across the lake looking for another meal. He tells them he is the bread, not the baker of it. John notes that from then on many of his disciples no longer walked with him.",
        descriptionFr:
          "Le lendemain de la multiplication, les gens le suivent de l'autre côté du lac en quête d'un autre repas. Il leur dit qu'il est le pain, non celui qui le fabrique. Jean précise que dès lors beaucoup de ses disciples ne marchèrent plus avec lui.",
        refs: [{ usfm: "JHN", ref: "6:24-66" }],
      },
      {
        id: "capernaum-woe",
        period: "gospels",
        weight: "notable",
        labelEn: "He names it among the towns that will fare worse than Sodom",
        labelFr:
          "Il la compte parmi les villes qui seront traitées plus durement que Sodome",
        refs: [{ usfm: "MAT", ref: "11:23-24" }],
      },
      {
        id: "capernaum-temple-tax",
        period: "gospels",
        weight: "reference",
        labelEn: "The temple tax is found in a fish's mouth at his word",
        labelFr:
          "L'impôt du temple se trouve dans la bouche d'un poisson, sur sa parole",
        refs: [{ usfm: "MAT", ref: "17:24-27" }],
      },
    ],
  },
  {
    id: "nazareth",
    nameEn: "Nazareth",
    nameFr: "Nazareth",
    lng: 35.29769,
    lat: 32.70214,
    tier: "notable",
    region: "galilee",
    blurbEn:
      "A hillside village of no reputation, where Jesus grew up and where his own synagogue first tried to kill him.",
    blurbFr:
      "Un village de colline sans renom, où Jésus grandit et où sa propre synagogue tenta d'abord de le tuer.",
    source: {
      site: "Nazareth",
      confidence: 1000,
      candidates: 1,
      slug: "nazareth",
    },
    curated: true,
    events: [
      {
        id: "nazareth-annunciation",
        period: "gospels",
        weight: "headline",
        labelEn: "Gabriel tells Mary she will bear a son",
        labelFr: "Gabriel dit à Marie qu'elle enfantera un fils",
        descriptionEn:
          "A girl in an unremarkable Galilean town is told she has found favour, and that the child will be called Son of the Most High. She asks how, is given an answer, and says let it be. Luke sets the whole gospel in motion in a place nobody was watching.",
        descriptionFr:
          "Une jeune fille d'une ville galiléenne sans éclat apprend qu'elle a trouvé grâce, et que l'enfant sera appelé Fils du Très-Haut. Elle demande comment, reçoit une réponse, et dit : qu'il me soit fait. Luc met tout l'évangile en marche dans un lieu que personne ne regardait.",
        refs: [{ usfm: "LUK", ref: "1:26-38" }],
      },
      {
        id: "nazareth-return",
        period: "gospels",
        weight: "notable",
        labelEn: "The family comes back from Egypt and settles here",
        labelFr: "La famille revient d'Égypte et s'établit ici",
        refs: [{ usfm: "MAT", ref: "2:19-23" }],
      },
      {
        id: "nazareth-boy",
        period: "gospels",
        weight: "reference",
        labelEn: "Jesus grows up here, and is found in the temple at twelve",
        labelFr:
          "Jésus y grandit, et on le retrouve au temple à l'âge de douze ans",
        refs: [{ usfm: "LUK", ref: "2:39-52" }],
      },
      {
        id: "nazareth-synagogue",
        period: "gospels",
        weight: "headline",
        labelEn: "He reads Isaiah in the synagogue and they try to throw him off the hill",
        labelFr:
          "Il lit Ésaïe dans la synagogue et l'on veut le précipiter de la colline",
        descriptionEn:
          "Home for the Sabbath, he is handed Isaiah and reads the line about good news to the poor, then says it has been fulfilled in their hearing. The room turns when he adds that prophets are not sent to their own. They drive him to the brow of the hill, and he walks through them and goes away.",
        descriptionFr:
          "De retour pour le sabbat, on lui tend Ésaïe ; il lit le passage sur la bonne nouvelle aux pauvres, puis dit qu'il s'est accompli à leurs oreilles. La salle bascule quand il ajoute que les prophètes ne sont pas envoyés aux leurs. On le pousse jusqu'au bord de la colline, et il passe au milieu d'eux et s'en va.",
        refs: [{ usfm: "LUK", ref: "4:16-30" }],
      },
      {
        id: "nazareth-unbelief",
        period: "gospels",
        weight: "notable",
        labelEn: "A later visit finds so little faith that he does few miracles",
        labelFr:
          "Une visite plus tard trouve si peu de foi qu'il n'y fait que peu de miracles",
        refs: [{ usfm: "MRK", ref: "6:1-6" }],
      },
      {
        id: "nazareth-can-anything",
        period: "gospels",
        weight: "reference",
        labelEn: "Nathanael asks whether anything good can come from here",
        labelFr: "Nathanaël demande si quelque chose de bon peut en venir",
        refs: [{ usfm: "JHN", ref: "1:45-46" }],
      },
    ],
  },
  {
    id: "cana",
    nameEn: "Cana",
    nameFr: "Cana",
    lng: 35.30269,
    lat: 32.8222,
    tier: "minor",
    region: "galilee",
    blurbEn:
      "A village in the hills above the lake, remembered for a wedding and for a father who took Jesus at his word.",
    blurbFr:
      "Un village dans les collines au-dessus du lac, dont on se souvient pour une noce et pour un père qui prit Jésus au mot.",
    source: {
      site: "Horbat Qana",
      confidence: 690,
      candidates: 3,
      slug: "cana",
    },
    events: [
      {
        id: "cana-wedding",
        period: "gospels",
        weight: "headline",
        labelEn: "The wine runs out, and the servants fill the jars with water",
        labelFr: "Le vin manque, et les serviteurs remplissent les jarres d'eau",
        descriptionEn:
          "John calls it the first of the signs. Jesus tells the servants to fill six stone jars used for purification; the steward tastes what comes out and complains that the best has been kept until now. His disciples see it, and they believe.",
        descriptionFr:
          "Jean l'appelle le premier des signes. Jésus dit aux serviteurs de remplir six jarres de pierre servant à la purification ; l'intendant goûte ce qui en sort et se plaint qu'on ait gardé le bon vin jusqu'à présent. Ses disciples voient cela, et ils croient.",
        refs: [{ usfm: "JHN", ref: "2:1-11" }],
      },
      {
        id: "cana-official",
        period: "gospels",
        weight: "headline",
        labelEn: "An official from Capernaum is told his son will live",
        labelFr: "Un officier de Capernaüm s'entend dire que son fils vivra",
        descriptionEn:
          "The man wants Jesus to come down before the child dies. Jesus sends him home with a sentence. The fever left at the seventh hour, the same hour the words were spoken, and the official believes, and his whole household with him.",
        descriptionFr:
          "L'homme veut que Jésus descende avant que l'enfant meure. Jésus le renvoie chez lui avec une phrase. La fièvre le quitta à la septième heure, à l'heure même où les paroles furent dites, et l'officier croit, et toute sa maison avec lui.",
        refs: [{ usfm: "JHN", ref: "4:46-54" }],
      },
      {
        id: "cana-nathanael",
        period: "gospels",
        weight: "reference",
        labelEn: "Nathanael, whom Jesus saw under the fig tree, is from here",
        labelFr: "Nathanaël, que Jésus a vu sous le figuier, est d'ici",
        refs: [{ usfm: "JHN", ref: "21:2" }],
      },
    ],
  },
  {
    id: "bethsaida",
    nameEn: "Bethsaida",
    nameFr: "Bethsaïda",
    lng: 35.63096,
    lat: 32.91038,
    tier: "minor",
    region: "galilee",
    blurbEn:
      "A lakeside town just east of the Jordan's mouth, home of three disciples and the subject of one of Jesus' hardest woes.",
    blurbFr:
      "Une ville du lac juste à l'est de l'embouchure du Jourdain, patrie de trois disciples et objet de l'un des plus durs malheurs prononcés par Jésus.",
    source: {
      site: "At Tell",
      confidence: 466,
      candidates: 4,
      slug: "bethsaida-1",
    },
    events: [
      {
        id: "bethsaida-home",
        period: "gospels",
        weight: "notable",
        labelEn: "Philip, Andrew and Peter come from here",
        labelFr: "Philippe, André et Pierre en sont originaires",
        refs: [{ usfm: "JHN", ref: "1:44" }],
      },
      {
        id: "bethsaida-blind-man",
        period: "gospels",
        weight: "headline",
        labelEn: "A blind man is healed in two stages, outside the village",
        labelFr: "Un aveugle est guéri en deux temps, hors du village",
        descriptionEn:
          "Jesus leads him out of the town, spits on his eyes, and asks what he sees. People look like trees walking. A second touch and he sees everything clearly. Jesus sends him home and tells him not to go back into the village.",
        descriptionFr:
          "Jésus le fait sortir de la ville, lui met de la salive sur les yeux et demande ce qu'il voit. Les gens ressemblent à des arbres qui marchent. Un second contact, et il voit tout distinctement. Jésus le renvoie chez lui et lui dit de ne pas rentrer dans le village.",
        refs: [{ usfm: "MRK", ref: "8:22-26" }],
      },
      {
        id: "bethsaida-feeding",
        period: "gospels",
        weight: "reference",
        labelEn: "The feeding of the five thousand takes place near here",
        labelFr: "La multiplication des pains a lieu près d'ici",
        refs: [{ usfm: "LUK", ref: "9:10-17" }],
      },
      {
        id: "bethsaida-woe",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus woes the town that saw the works and did not repent",
        labelFr:
          "Jésus prononce le malheur sur la ville qui a vu les œuvres et ne s'est pas repentie",
        descriptionEn:
          "Bethsaida is named with Chorazin: if the same deeds had been done in Tyre and Sidon, they would have sat in sackcloth. The hometown of three apostles is told it will be more bearable for the pagan ports on the day of judgment.",
        descriptionFr:
          "Bethsaïda est nommée avec Chorazin : si les mêmes actes avaient été faits à Tyr et à Sidon, elles se seraient assises dans le sac. La ville natale de trois apôtres s'entend dire qu'il y aura plus d'indulgence pour les ports païens, au jour du jugement.",
        refs: [{ usfm: "MAT", ref: "11:21-22" }],
      },
    ],
  },
];

export const COAST: City[] = [
  {
    id: "tyre",
    nameEn: "Tyre",
    nameFr: "Tyr",
    lng: 35.196111,
    lat: 33.270833,
    tier: "major",
    region: "coast",
    blurbEn:
      "An island port that grew rich selling to the whole Mediterranean, and which the prophets treat as the type of a city that has confused wealth with security.",
    blurbFr:
      "Un port insulaire enrichi par tout le commerce de la Méditerranée, et dont les prophètes font le type de la ville qui a pris sa richesse pour une garantie.",
    source: {
      site: "Tyre",
      confidence: 1000,
      candidates: 1,
      slug: "tyre",
    },
    curated: true,
    events: [
      {
        id: "tyre-hiram-david",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "Hiram of Tyre sends cedar and craftsmen to build David's house",
        labelFr:
          "Hiram de Tyr envoie du cèdre et des artisans pour bâtir la maison de David",
        refs: [{ usfm: "2SA", ref: "5:11" }],
      },
      {
        id: "tyre-hiram-solomon",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "Hiram supplies the timber and bronze work for the temple",
        labelFr: "Hiram fournit le bois et l'ouvrage de bronze du temple",
        descriptionEn:
          "Solomon writes to Tyre for cedar of Lebanon and for a man who can work gold, silver and bronze. Hiram sends both, and the two kings run a joint fleet from Ezion-geber. The temple in Jerusalem is, in materials, a Tyrian building.",
        descriptionFr:
          "Salomon écrit à Tyr pour du cèdre du Liban et pour un homme capable de travailler l'or, l'argent et le bronze. Hiram envoie les deux, et les deux rois arment une flotte commune depuis Etsjon-Guéber. Le temple de Jérusalem est, par ses matériaux, un édifice tyrien.",
        refs: [
          { usfm: "1KI", ref: "5:1-12" },
          { usfm: "1KI", ref: "7:13-14" },
        ],
      },
      {
        id: "tyre-jezebel",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Ahab marries Jezebel, daughter of the king of the Sidonians",
        labelFr: "Achab épouse Jézabel, fille du roi des Sidoniens",
        refs: [{ usfm: "1KI", ref: "16:31" }],
      },
      {
        id: "tyre-amos",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Amos indicts it for selling a whole people into exile",
        labelFr: "Amos l'accuse d'avoir vendu tout un peuple pour l'exil",
        refs: [{ usfm: "AMO", ref: "1:9-10" }],
      },
      {
        id: "tyre-isaiah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Isaiah says her trading will be forgotten for seventy years",
        labelFr:
          "Ésaïe dit que son commerce sera oublié pendant soixante-dix ans",
        refs: [{ usfm: "ISA", ref: "23:1-18" }],
      },
      {
        id: "tyre-ezekiel",
        period: "exileReturn",
        weight: "headline",
        labelEn: "Ezekiel sings the wreck of a ship that thought itself a god",
        labelFr:
          "Ézéchiel chante le naufrage d'un navire qui se prenait pour un dieu",
        descriptionEn:
          "Two long oracles catalogue every port Tyre traded with, then watch the ship go down in open water. The charge is not trade itself but the conclusion Tyre drew from it: 'I am perfect in beauty.' Ezekiel says the same day will come for any city that says that.",
        descriptionFr:
          "Deux longs oracles dressent la liste de tous les ports avec lesquels Tyr commerçait, puis voient le navire sombrer au large. Le grief n'est pas le commerce, c'est la conclusion que Tyr en tirait : « je suis parfaite en beauté ». Ézéchiel dit que le même jour viendra pour toute ville qui dit cela.",
        refs: [
          { usfm: "EZK", ref: "26:1-21" },
          { usfm: "EZK", ref: "27:1-36" },
        ],
      },
      {
        id: "tyre-jesus",
        period: "gospels",
        weight: "headline",
        labelEn: "A Syrophoenician woman will not take no for an answer",
        labelFr: "Une Syrophénicienne ne s'en laisse pas conter",
        descriptionEn:
          "Jesus goes to the district of Tyre and tries to stay hidden. A Greek woman finds him anyway and asks for her daughter. He tells her the children's bread is not for the dogs; she answers that even the dogs eat the crumbs, and he heals the child from there.",
        descriptionFr:
          "Jésus gagne la région de Tyr et cherche à passer inaperçu. Une femme grecque le trouve quand même et demande pour sa fille. Il lui dit que le pain des enfants n'est pas pour les petits chiens ; elle répond que les petits chiens mangent bien les miettes, et il guérit l'enfant de là.",
        refs: [{ usfm: "MRK", ref: "7:24-30" }],
      },
      {
        id: "tyre-paul",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "The believers kneel on the beach and beg Paul not to go on",
        labelFr:
          "Les croyants s'agenouillent sur la plage et supplient Paul de ne pas continuer",
        refs: [{ usfm: "ACT", ref: "21:1-6" }],
      },
    ],
  },
  {
    id: "sidon",
    nameEn: "Sidon",
    nameFr: "Sidon",
    lng: 35.371944,
    lat: 33.560985,
    tier: "notable",
    region: "coast",
    blurbEn:
      "Tyre's older neighbour on the Phoenician coast, the city Jezebel came from and the one Elijah was sent to during the drought.",
    blurbFr:
      "La voisine plus ancienne de Tyr sur la côte phénicienne, la ville d'où venait Jézabel et celle vers laquelle Élie fut envoyé pendant la sécheresse.",
    source: {
      site: "Sandikli archaeological site in Sidon",
      confidence: 1000,
      candidates: 1,
      slug: "sidon",
    },
    curated: true,
    events: [
      {
        id: "sidon-allotment",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "It is named as the northern mark of Canaan, and Asher never takes it",
        labelFr:
          "Elle est nommée comme borne nord de Canaan, et Aser ne la prend jamais",
        refs: [
          { usfm: "GEN", ref: "10:19" },
          { usfm: "JDG", ref: "1:31" },
        ],
      },
      {
        id: "sidon-elijah",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Elijah is sent to a widow of Zarephath, in Sidon's territory",
        labelFr:
          "Élie est envoyé chez une veuve de Sarepta, au pays de Sidon",
        descriptionEn:
          "While Israel starves, God sends the prophet past the border to a Gentile widow down to her last handful of meal. The jar does not empty. When her son dies, Elijah stretches himself on the child and gives him back. Jesus will later throw this story in Nazareth's face.",
        descriptionFr:
          "Tandis qu'Israël a faim, Dieu envoie le prophète au-delà de la frontière, chez une veuve païenne réduite à sa dernière poignée de farine. La jarre ne s'épuise pas. Quand son fils meurt, Élie s'étend sur l'enfant et le lui rend. Jésus jettera plus tard cette histoire à la face de Nazareth.",
        refs: [{ usfm: "1KI", ref: "17:8-24" }],
      },
      {
        id: "sidon-jezebel",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Jezebel, a Sidonian princess, brings Baal into Samaria",
        labelFr: "Jézabel, princesse sidonienne, introduit Baal à Samarie",
        refs: [{ usfm: "1KI", ref: "16:31" }],
      },
      {
        id: "sidon-ezekiel",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Ezekiel speaks a shorter oracle against it, beside Tyre's",
        labelFr: "Ézéchiel prononce contre elle un oracle plus bref, à côté de celui de Tyr",
        refs: [{ usfm: "EZK", ref: "28:20-23" }],
      },
      {
        id: "sidon-jesus-crowd",
        period: "gospels",
        weight: "notable",
        labelEn: "People from Sidon come south to hear Jesus",
        labelFr: "Des gens de Sidon descendent pour entendre Jésus",
        refs: [{ usfm: "MRK", ref: "3:7-8" }],
      },
      {
        id: "sidon-woe",
        period: "gospels",
        weight: "headline",
        labelEn: "Jesus says Tyre and Sidon would have repented in sackcloth",
        labelFr:
          "Jésus dit que Tyr et Sidon se seraient repenties dans le sac",
        descriptionEn:
          "The comparison is meant to sting Galilee: the old pagan ports, given the same works, would have turned. Sidon is not commended for virtue. It is used as the measure of how much light Capernaum had wasted.",
        descriptionFr:
          "La comparaison vise à piquer la Galilée : les vieux ports païens, devant les mêmes œuvres, se seraient convertis. Sidon n'est pas louée pour sa vertu. Elle sert de mesure à la lumière que Capernaüm a gaspillée.",
        refs: [{ usfm: "MAT", ref: "11:21-22" }],
      },
    ],
  },
  {
    id: "joppa",
    nameEn: "Joppa",
    nameFr: "Joppé",
    lng: 34.753039,
    lat: 32.054481,
    tier: "notable",
    region: "coast",
    blurbEn:
      "Judah's only natural harbour, the port Jonah fled from and the house where Peter learned that no one is unclean.",
    blurbFr:
      "Le seul port naturel de Juda, celui dont Jonas s'enfuit et la maison où Pierre apprit que personne n'est impur.",
    source: {
      site: "Jaffa",
      confidence: 1000,
      candidates: 1,
      slug: "joppa",
    },
    curated: true,
    events: [
      {
        id: "joppa-allotment",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "The border of Dan reaches the sea opposite it",
        labelFr: "La frontière de Dan atteint la mer vis-à-vis d'elle",
        refs: [{ usfm: "JOS", ref: "19:46" }],
      },
      {
        id: "joppa-temple-timber",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "Cedar for the temple is floated down the coast and landed here",
        labelFr:
          "Le cèdre du temple est flotté le long de la côte et débarqué ici",
        refs: [{ usfm: "2CH", ref: "2:16" }],
      },
      {
        id: "joppa-jonah",
        period: "dividedMonarchy",
        weight: "headline",
        labelEn: "Jonah finds a ship going the other way",
        labelFr: "Jonas trouve un navire qui va dans l'autre sens",
        descriptionEn:
          "Told to go east to Nineveh, he comes down to Joppa and pays the fare west. The port is doing what ports do: taking whoever has the money. The storm, the lots and the fish all start from this quay.",
        descriptionFr:
          "Envoyé vers l'est, à Ninive, il descend à Joppé et paie le passage vers l'ouest. Le port fait ce que font les ports : il embarque qui paie. La tempête, les sorts et le poisson partent tous de ce quai.",
        refs: [{ usfm: "JON", ref: "1:1-3" }],
      },
      {
        id: "joppa-second-temple",
        period: "exileReturn",
        weight: "reference",
        labelEn: "Timber for the second temple is landed here again",
        labelFr: "Le bois du second temple y est de nouveau débarqué",
        refs: [{ usfm: "EZR", ref: "3:7" }],
      },
      {
        id: "joppa-tabitha",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Peter is called from Lydda and raises Tabitha",
        labelFr: "Pierre est appelé de Lydda et relève Tabitha",
        descriptionEn:
          "A disciple known for making clothes for widows dies. The church in Joppa sends for Peter, who has just healed Aeneas in the next town. He puts them all out, prays, and tells the body to get up. The widows are shown their friend alive, still wearing what she sewed.",
        descriptionFr:
          "Une disciple connue pour habiller les veuves meurt. L'église de Joppé envoie chercher Pierre, qui vient de guérir Énée dans la ville voisine. Il les fait tous sortir, prie, et dit au corps de se lever. On montre aux veuves leur amie vivante, encore vêtue de ce qu'elle avait cousu.",
        refs: [{ usfm: "ACT", ref: "9:36-42" }],
      },
      {
        id: "joppa-sheet",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "On a rooftop at noon, a sheet of unclean animals is lowered",
        labelFr:
          "Sur un toit, à midi, on lui descend une nappe d'animaux impurs",
        descriptionEn:
          "Hungry and waiting for lunch, Peter sees the same vision three times: kill and eat, what God has made clean you must not call common. While he is still turning it over, the messengers from Cornelius arrive, and the vision gets its interpretation in a Gentile living room in Caesarea.",
        descriptionFr:
          "Affamé et attendant le repas, Pierre voit trois fois la même vision : tue et mange ; ce que Dieu a déclaré pur, ne l'appelle pas souillé. Tandis qu'il y réfléchit encore, les envoyés de Corneille arrivent, et la vision trouve son sens dans le salon d'un païen, à Césarée.",
        refs: [{ usfm: "ACT", ref: "10:9-23" }],
      },
    ],
  },
  {
    id: "caesarea",
    nameEn: "Caesarea",
    nameFr: "Césarée",
    lng: 34.891667,
    lat: 32.5,
    tier: "notable",
    region: "coast",
    blurbEn:
      "Herod's purpose-built harbour and the Roman capital of Judea, where the gospel first crossed into a Gentile household and where Paul was held for two years.",
    blurbFr:
      "Le port voulu par Hérode et la capitale romaine de la Judée, où l'Évangile entra pour la première fois dans une maison païenne et où Paul fut détenu deux ans.",
    source: {
      site: "Caesarea Maritima",
      confidence: 1000,
      candidates: 1,
      slug: "caesarea",
    },
    curated: true,
    events: [
      {
        id: "caesarea-philip",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Philip the evangelist settles here after the road to Gaza",
        labelFr:
          "Philippe l'évangéliste s'y établit après la route de Gaza",
        refs: [{ usfm: "ACT", ref: "8:40" }],
      },
      {
        id: "caesarea-cornelius",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Cornelius the centurion is told to send for Peter",
        labelFr: "Le centurion Corneille reçoit l'ordre d'envoyer chercher Pierre",
        descriptionEn:
          "A God-fearing officer, generous to the Jewish poor, sees an angel in the afternoon and is told to fetch a man staying by the sea at Joppa. Before Peter has finished speaking, the Spirit falls on the household, and the first Gentiles are baptised. Peter has to explain himself in Jerusalem afterwards.",
        descriptionFr:
          "Un officier craignant Dieu, généreux envers les pauvres juifs, voit un ange dans l'après-midi et doit faire venir un homme logé au bord de la mer, à Joppé. Avant que Pierre ait fini de parler, l'Esprit tombe sur la maison, et les premiers païens sont baptisés. Pierre devra s'en expliquer ensuite à Jérusalem.",
        refs: [{ usfm: "ACT", ref: "10:1-48" }],
      },
      {
        id: "caesarea-herod-agrippa",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Herod Agrippa is struck down in the theatre after the crowd calls him a god",
        labelFr:
          "Hérode Agrippa est frappé au théâtre après que la foule l'a appelé dieu",
        refs: [{ usfm: "ACT", ref: "12:19-23" }],
      },
      {
        id: "caesarea-paul-lands",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Paul lands here at the end of the second journey",
        labelFr: "Paul y débarque à la fin du second voyage",
        refs: [{ usfm: "ACT", ref: "18:22" }],
      },
      {
        id: "caesarea-agabus",
        period: "earlyChurch",
        weight: "notable",
        labelEn: "Agabus binds himself with Paul's belt and tells him not to go up",
        labelFr:
          "Agabus se lie avec la ceinture de Paul et lui dit de ne pas monter",
        refs: [{ usfm: "ACT", ref: "21:8-14" }],
      },
      {
        id: "caesarea-imprisonment",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Paul is held here two years and makes his defence to Felix, Festus and Agrippa",
        labelFr:
          "Paul y est détenu deux ans et se défend devant Félix, Festus et Agrippa",
        descriptionEn:
          "Brought down from Jerusalem under military escort, Paul sits in Herod's praetorium while governors stall and successors arrive. He reasons about righteousness and judgment until Felix is afraid; he appeals to Caesar to escape a Jerusalem ambush; and Agrippa hears him almost persuaded. The harbour that received the first Gentile convert now ships the apostle to Rome.",
        descriptionFr:
          "Amené de Jérusalem sous escorte militaire, Paul séjourne dans le prétoire d'Hérode tandis que les gouverneurs temporisent et que les successeurs arrivent. Il parle de justice et de jugement jusqu'à ce que Félix ait peur ; il en appelle à César pour échapper à une embuscade à Jérusalem ; et Agrippa l'écoute, presque persuadé. Le port qui avait reçu le premier converti païen embarque maintenant l'apôtre pour Rome.",
        refs: [
          { usfm: "ACT", ref: "23:23-35" },
          { usfm: "ACT", ref: "24:24-27" },
          { usfm: "ACT", ref: "26:1-32" },
        ],
      },
    ],
  },
  {
    id: "gaza",
    nameEn: "Gaza",
    nameFr: "Gaza",
    lng: 34.4644,
    lat: 31.504,
    tier: "notable",
    region: "coast",
    blurbEn:
      "The southernmost of the five Philistine cities, on the road down to Egypt, and the city whose gates Samson once carried away.",
    blurbFr:
      "La plus méridionale des cinq villes philistines, sur la route d'Égypte, et celle dont Samson emporta un jour les portes.",
    source: {
      site: "Tell Harube",
      confidence: 1000,
      candidates: 1,
      slug: "gaza",
    },
    curated: true,
    events: [
      {
        id: "gaza-allotment",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "It is allotted to Judah but remains in Philistine hands",
        labelFr: "Elle est attribuée à Juda mais reste aux mains des Philistins",
        refs: [
          { usfm: "JOS", ref: "15:47" },
          { usfm: "JOS", ref: "13:3" },
        ],
      },
      {
        id: "gaza-samson-gates",
        period: "judges",
        weight: "notable",
        labelEn: "Samson carries the city gates up the hill toward Hebron",
        labelFr: "Samson emporte les portes de la ville vers Hébron",
        refs: [{ usfm: "JDG", ref: "16:1-3" }],
      },
      {
        id: "gaza-samson-death",
        period: "judges",
        weight: "headline",
        labelEn: "Blind and mocked, Samson pulls the temple down on the lords of the Philistines",
        labelFr:
          "Aveugle et raillé, Samson fait crouler le temple sur les princes philistins",
        descriptionEn:
          "After Delilah has him, the Philistines put out his eyes and set him to grind in the prison here. At a feast for Dagon they bring him out to perform. He asks to feel the pillars, and the house falls on the lords and on the crowd on the roof. The narrator says he killed more in dying than in living.",
        descriptionFr:
          "Après que Dalila l'a livré, les Philistins lui crèvent les yeux et le font tourner la meule dans la prison d'ici. À une fête de Dagon, on le fait sortir pour qu'il joue. Il demande à tâter les piliers, et la maison s'écroule sur les princes et sur la foule du toit. Le narrateur dit qu'il en tua plus en mourant qu'en vivant.",
        refs: [{ usfm: "JDG", ref: "16:21-30" }],
      },
      {
        id: "gaza-hezekiah",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Hezekiah strikes the Philistines as far as this city",
        labelFr: "Ézéchias frappe les Philistins jusqu'à cette ville",
        refs: [{ usfm: "2KI", ref: "18:8" }],
      },
      {
        id: "gaza-amos",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Amos condemns it for deporting whole communities",
        labelFr: "Amos la condamne pour avoir déporté des communautés entières",
        refs: [{ usfm: "AMO", ref: "1:6-7" }],
      },
      {
        id: "gaza-philip",
        period: "earlyChurch",
        weight: "headline",
        labelEn: "Philip meets the Ethiopian on the desert road that goes down to this city",
        labelFr:
          "Philippe rencontre l'Éthiopien sur la route déserte qui descend vers cette ville",
        descriptionEn:
          "An angel sends Philip south on the road from Jerusalem to Gaza, the one that is desert. A court official of Candace is reading Isaiah in his chariot and cannot make sense of the lamb led to slaughter. Philip starts from that scripture and baptises him at the first water they come to.",
        descriptionFr:
          "Un ange envoie Philippe au sud, sur le chemin de Jérusalem à Gaza, celui qui est désert. Un eunuque de Candace lit Ésaïe dans son char et ne comprend pas l'agneau mené à la tuerie. Philippe part de cette écriture et le baptise à la première eau qu'ils trouvent.",
        refs: [
          { usfm: "ACT", ref: "8:26-36" },
          { usfm: "ACT", ref: "8:38-39" },
        ],
      },
    ],
  },
  {
    id: "ashdod",
    nameEn: "Ashdod",
    nameFr: "Asdod",
    lng: 34.6578,
    lat: 31.7572,
    tier: "notable",
    region: "coast",
    blurbEn:
      "One of the five Philistine lordships, the first city to receive the captured ark and the last to learn that Dagon could not keep it.",
    blurbFr:
      "L'une des cinq seigneuries philistines, la première ville à recevoir l'arche capturée et la dernière à comprendre que Dagon ne pouvait la garder.",
    source: {
      site: "Tel Ashdod",
      confidence: 1000,
      candidates: 1,
      slug: "ashdod",
    },
    curated: true,
    events: [
      {
        id: "ashdod-unconquered",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Joshua takes the land, but Ashdod is left to the Anakim",
        labelFr: "Josué prend le pays, mais Asdod est laissée aux Anakim",
        refs: [{ usfm: "JOS", ref: "11:22" }],
      },
      {
        id: "ashdod-ark",
        period: "judges",
        weight: "headline",
        labelEn: "The ark is set in Dagon's temple, and the idol falls on its face",
        labelFr: "L'arche est placée dans le temple de Dagon, et l'idole tombe la face contre terre",
        descriptionEn:
          "The Philistines treat the captured ark as spoils for their god. In the morning Dagon is on the ground before it; the next morning he is headless and handless on the threshold. Tumours break out in the city, and the people of Ashdod decide the ark has to go somewhere else.",
        descriptionFr:
          "Les Philistins traitent l'arche capturée comme un trophée pour leur dieu. Au matin, Dagon est à terre devant elle ; le lendemain, il est sans tête ni mains sur le seuil. Des tumeurs éclatent dans la ville, et les gens d'Asdod décident que l'arche doit aller ailleurs.",
        refs: [{ usfm: "1SA", ref: "5:1-8" }],
      },
      {
        id: "ashdod-uzziah",
        period: "dividedMonarchy",
        weight: "notable",
        labelEn: "Uzziah breaks down its wall and builds Judean towns in its territory",
        labelFr:
          "Ozias abat sa muraille et bâtit des villes judéennes sur son territoire",
        refs: [{ usfm: "2CH", ref: "26:6" }],
      },
      {
        id: "ashdod-amos",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Amos tells it to look at the unrest in its own streets",
        labelFr: "Amos lui dit de regarder le trouble dans ses propres rues",
        refs: [{ usfm: "AMO", ref: "3:9" }],
      },
      {
        id: "ashdod-nehemiah",
        period: "exileReturn",
        weight: "headline",
        labelEn: "Nehemiah finds children in Judah who speak the language of Ashdod",
        labelFr:
          "Néhémie trouve en Juda des enfants qui parlent la langue d'Asdod",
        descriptionEn:
          "Half the children of mixed marriages cannot speak the language of Judah. Nehemiah treats it as the old compromise coming back: the same coastal cities Israel never quite subdued are now inside the households of the returned exiles. He makes the men swear not to give their children to them again.",
        descriptionFr:
          "La moitié des enfants des mariages mixtes ne savent pas parler la langue de Juda. Néhémie y voit le vieux compromis qui revient : les mêmes villes côtières qu'Israël n'avait jamais tout à fait soumises sont maintenant dans les maisons des exilés de retour. Il fait jurer aux hommes de ne plus leur donner leurs enfants.",
        refs: [{ usfm: "NEH", ref: "13:23-27" }],
      },
      {
        id: "ashdod-philip-passed",
        period: "earlyChurch",
        weight: "reference",
        labelEn: "Philip is found here after the Ethiopian is baptised",
        labelFr: "Philippe se retrouve ici après le baptême de l'Éthiopien",
        refs: [{ usfm: "ACT", ref: "8:40" }],
      },
    ],
  },
  {
    id: "gath",
    nameEn: "Gath",
    nameFr: "Gath",
    lng: 34.84694,
    lat: 31.69972,
    tier: "notable",
    region: "coast",
    blurbEn:
      "Goliath's city, and the Philistine capital David fled to twice: once feigning madness, once as a mercenary with six hundred men.",
    blurbFr:
      "La ville de Goliath, et la capitale philistine où David se réfugia deux fois : une fois en simulant la folie, une fois comme mercenaire à la tête de six cents hommes.",
    source: {
      site: "Tell es Safi",
      confidence: 850,
      candidates: 6,
      slug: "gath-1",
    },
    curated: true,
    events: [
      {
        id: "gath-anakim",
        period: "exodusConquest",
        weight: "reference",
        labelEn: "Anakim are left in Gath after the conquest",
        labelFr: "Des Anakim restent à Gath après la conquête",
        refs: [{ usfm: "JOS", ref: "11:22" }],
      },
      {
        id: "gath-ark",
        period: "judges",
        weight: "notable",
        labelEn: "The ark is sent here from Ashdod and the panic follows it",
        labelFr: "L'arche est envoyée ici depuis Asdod et la panique la suit",
        refs: [{ usfm: "1SA", ref: "5:8-9" }],
      },
      {
        id: "gath-goliath",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "Goliath of Gath comes out to defy the armies of Israel",
        labelFr: "Goliath de Gath sort pour défier les armées d'Israël",
        descriptionEn:
          "The champion is introduced by his city before his name. For forty days he offers single combat in the valley of Elah, and it is a boy from Bethlehem, carrying food to his brothers, who walks out to meet him with a sling and five stones.",
        descriptionFr:
          "Le champion est présenté par sa ville avant son nom. Pendant quarante jours il propose un combat singulier dans la vallée d'Éla, et c'est un garçon de Bethléem, porteur de vivres pour ses frères, qui sort à sa rencontre avec une fronde et cinq cailloux.",
        refs: [{ usfm: "1SA", ref: "17:4-50" }],
      },
      {
        id: "gath-david-madness",
        period: "unitedMonarchy",
        weight: "headline",
        labelEn: "David arrives with Goliath's sword and pretends to be insane",
        labelFr: "David arrive avec l'épée de Goliath et simule la folie",
        descriptionEn:
          "Fresh from Nob, carrying the one sword in Israel that everyone would recognise, David walks into Goliath's own city. Achish's servants remind the king who he is. David scratches the doors and lets spit run down his beard, and Achish sends him away as a madman.",
        descriptionFr:
          "Tout juste sorti de Nob, portant la seule épée d'Israël que tout le monde reconnaîtrait, David entre dans la ville même de Goliath. Les serviteurs d'Akisch rappellent au roi qui il est. David griffe les battants et laisse couler sa salive sur sa barbe, et Akisch le renvoie comme un fou.",
        refs: [{ usfm: "1SA", ref: "21:10-15" }],
      },
      {
        id: "gath-david-returns",
        period: "unitedMonarchy",
        weight: "notable",
        labelEn: "David comes back with six hundred men and is given Ziklag",
        labelFr: "David revient avec six cents hommes et reçoit Tsiglag",
        refs: [{ usfm: "1SA", ref: "27:1-7" }],
      },
      {
        id: "gath-ittaii",
        period: "unitedMonarchy",
        weight: "reference",
        labelEn: "Ittai the Gittite marches with David when Absalom rises",
        labelFr: "Ittaï le Guitien marche avec David quand Absalom se soulève",
        refs: [{ usfm: "2SA", ref: "15:18-22" }],
      },
      {
        id: "gath-hazael",
        period: "dividedMonarchy",
        weight: "reference",
        labelEn: "Hazael of Aram captures it in the days of Jehoash",
        labelFr: "Hazaël d'Aram s'en empare aux jours de Joas",
        refs: [{ usfm: "2KI", ref: "12:17" }],
      },
    ],
  },
];
