# EDUCATION.md — Treści edukacyjne

Gotowe dane do wklejenia do `src/data/signs/levelN.json`.
Zwalidowane pod kątem prostego języka dla dzieci klas 1–3 (krótkie zdania, brak trudnych słów).

## Level 1 — Wiosna, Rozlewiska Biebrzy

```json
[
  {
    "id": "L1_S1",
    "position": { "x": 640, "y": 450 },
    "spriteVariant": "wooden",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Bocian biały",
        "text": "Bocian biały wraca do Polski każdej wiosny. Leci aż z Afryki — to prawie 10 000 kilometrów! Swoje gniazdo buduje na tym samym miejscu przez wiele lat.",
        "illustration": "bocian_nest",
        "birdSound": "bird_bocian"
      },
      {
        "type": "location",
        "title": "Biebrzański Park Narodowy",
        "text": "To największy park narodowy w Polsce! Bagna i rozlewiska Biebrzy to dom dla ponad 270 gatunków ptaków. Wiosną można tu zobaczyć tysiące żurawi i kaczek.",
        "illustration": "biebrza_map"
      },
      {
        "type": "threat",
        "title": "Uwaga: mokradła znikają",
        "text": "Bagna i mokradła są osuszane, żeby zrobić miejsce na pola. Gdy mokradła znikają, bocian i żuraw tracą swój dom i jedzenie.",
        "illustration": "threat_drainage",
        "severity": "high"
      },
      {
        "type": "quiz",
        "question": "Skąd wraca bocian każdej wiosny?",
        "answers": ["Z Afryki", "Z Azji", "Z Francji"],
        "correctIndex": 0,
        "feedbackCorrect": "Tak jest! Bociany spędzają zimę w ciepłej Afryce.",
        "feedbackWrong": "Prawie! Bociany lecą aż do Afryki na zimę."
      }
    ]
  },
  {
    "id": "L1_S2",
    "position": { "x": 1920, "y": 400 },
    "spriteVariant": "wooden",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Żuraw",
        "text": "Żuraw to jeden z największych ptaków latających w Polsce. Ma szare pióra i czerwoną plamkę na głowie. Żurawie tańczą ze sobą — to ich sposób na znalezienie partnera na całe życie!",
        "illustration": "zuraw_dance",
        "birdSound": "bird_zuraw"
      },
      {
        "type": "location",
        "title": "Rozlewiska — raj dla ptaków",
        "text": "Gdy rzeka Biebrza wylewa wiosną, tworzy ogromne jeziora na łąkach. Ryby, żaby i owady wychodzą wszędzie. To dla ptaków jak wielka restauracja!",
        "illustration": "biebrza_flood"
      },
      {
        "type": "threat",
        "title": "Hałas i płoszenie",
        "text": "Żurawie potrzebują spokoju, żeby wychować pisklęta. Głośni ludzie i psy bez smyczy mogą sprawić, że żuraw porzuci gniazdo.",
        "illustration": "threat_disturbance",
        "severity": "medium"
      },
      {
        "type": "quiz",
        "question": "Jak żurawie szukają partnera?",
        "answers": ["Tańczą razem", "Śpiewają piosenki", "Budują gniazdo"],
        "correctIndex": 0,
        "feedbackCorrect": "Dokładnie! Taniec żurawia jest bardzo piękny.",
        "feedbackWrong": "Nie tym razem — żurawie tańczą, żeby znaleźć parę!"
      }
    ]
  },
  {
    "id": "L1_S3",
    "position": { "x": 3200, "y": 380 },
    "spriteVariant": "rustic",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Orzeł bielik",
        "text": "Bielik to największy orzeł w Polsce i nasz symbol narodowy! Ma białe pióra ogona i żółty dziób. Poluje na ryby — wlatuje w wodę i chwyta je szponami.",
        "illustration": "bielik_fishing",
        "birdSound": "bird_bielik"
      },
      {
        "type": "location",
        "title": "Bagna chronią klimat",
        "text": "Bagna to nie brudna woda — to coś bardzo ważnego! Przechowują ogromne ilości węgla i chronią nas przed suszą. Jeden hektar bagna robi więcej dobrego niż cały las!",
        "illustration": "carbon_storage"
      },
      {
        "type": "threat",
        "title": "Trucizna w rybach",
        "text": "Gdy ludzie zatruwają wody chemikaliami, ryby stają się trujące. Bielik, który zje taką rybę, może zachorować i zginąć.",
        "illustration": "threat_pollution",
        "severity": "high"
      },
      {
        "type": "quiz",
        "question": "Czym poluje bielik?",
        "answers": ["Szponami łapie ryby", "Dziobem kopie w ziemię", "Siatką jak rybak"],
        "correctIndex": 0,
        "feedbackCorrect": "Super! Bielik ma bardzo silne szpony.",
        "feedbackWrong": "Spróbuj jeszcze raz — bielik używa szponów!"
      }
    ]
  },
  {
    "id": "L1_S4",
    "position": { "x": 4800, "y": 360 },
    "spriteVariant": "wooden",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Remiz — mistrz budowania",
        "text": "Remiz to malutki ptak, który buduje niezwykłe gniazdo. Wygląda jak torebka wisząca nad wodą! Samiec buduje gniazdo, żeby przyciągnąć samicę.",
        "illustration": "remiz_nest",
        "birdSound": "bird_zuraw"
      },
      {
        "type": "location",
        "title": "Jak chroniony jest park?",
        "text": "W Biebrzańskim Parku Narodowym nie wolno budować domów, wycinać drzew ani polować. Strażnicy pilnują, żeby zwierzęta miały spokój.",
        "illustration": "park_ranger"
      },
      {
        "type": "threat",
        "title": "Inwazyjne rośliny",
        "text": "Niektóre rośliny przywiezione z innych krajów rosną tak szybko, że wypierają polskie rośliny. Wtedy owady i ptaki nie mają co jeść.",
        "illustration": "threat_invasive",
        "severity": "medium"
      },
      {
        "type": "quiz",
        "question": "Dlaczego samiec remiza buduje gniazdo?",
        "answers": ["Żeby przyciągnąć samicę", "Żeby się ogrzać zimą", "Żeby schować jedzenie"],
        "correctIndex": 0,
        "feedbackCorrect": "Brawo! Samiec remiza jest jak prawdziwy architekt.",
        "feedbackWrong": "Spróbuj jeszcze raz — samiec remiza buduję gniazdo dla partnerki!"
      }
    ]
  },
  {
    "id": "L1_S5_HIDDEN",
    "position": { "x": 5500, "y": 200 },
    "spriteVariant": "golden",
    "isHidden": true,
    "pages": [
      {
        "type": "bird_fact",
        "title": "Sekret: Derkacz — mistrz kamuflażu",
        "text": "Derkacza słyszysz, ale prawie nigdy nie widzisz! Chowa się w wysokiej trawie. Jego głos 'krek-krek' słychać w nocy na łąkach Biebrzy.",
        "illustration": "derkacz_hidden",
        "birdSound": "bird_bocian"
      },
      {
        "type": "quiz",
        "question": "Dlaczego trudno zobaczyć derkacza?",
        "answers": ["Chowa się w trawie", "Lata bardzo szybko", "Żyje pod wodą"],
        "correctIndex": 0,
        "feedbackCorrect": "Dokładnie! Znalazłeś sekret tej tabliczki — jesteś świetnym obserwatorem!",
        "feedbackWrong": "Derkacz chowa się w trawie — prawie nikt go nie widzi!"
      }
    ]
  }
]
```

## Level 2 — Lato, Słowiński Park Narodowy

```json
[
  {
    "id": "L2_S1",
    "position": { "x": 700, "y": 420 },
    "spriteVariant": "coastal",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Zimorodek",
        "text": "Zimorodek to jeden z najpiękniejszych polskich ptaków! Ma turkusowe i pomarańczowe pióra. Tak szybko nurkuje w wodę po ryby, że ledwo go widać.",
        "illustration": "zimorodek_dive",
        "birdSound": "bird_zimorodek"
      },
      {
        "type": "location",
        "title": "Słowiński Park Narodowy",
        "text": "Ten park słynie z wędrujących wydm! Góry piasku przesuwają się powoli w stronę lasu — nawet o kilka metrów na rok. To jedyne takie miejsce w Polsce.",
        "illustration": "slowinski_dunes"
      },
      {
        "type": "threat",
        "title": "Plastik w morzu",
        "text": "Plastikowe butelki i torby trafiają do morza. Ptaki morskie mylą je z jedzeniem i połykają. To jest dla nich bardzo niebezpieczne.",
        "illustration": "threat_plastic",
        "severity": "high"
      },
      {
        "type": "quiz",
        "question": "Co jest wyjątkowego w Słowińskim Parku?",
        "answers": ["Wędrujące wydmy", "Największy wulkan", "Najgłębsze jezioro"],
        "correctIndex": 0,
        "feedbackCorrect": "Tak! Wydmy wędrują jak żywe — to niesamowite!",
        "feedbackWrong": "Słowiński Park słynie z wędrujących wydm piaskowych!"
      }
    ]
  },
  {
    "id": "L2_S2",
    "position": { "x": 2100, "y": 380 },
    "spriteVariant": "coastal",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Mewa śmieszka",
        "text": "Mewa śmieszka ma śmieszną czarną głowę latem! Zimą robi się biała z tylko czarną plamką. Mewy są bardzo głośne i kłótliwe — zawsze walczą o jedzenie.",
        "illustration": "mewa_colony",
        "birdSound": "bird_zuraw"
      },
      {
        "type": "location",
        "title": "Jezioro Łebsko",
        "text": "Jezioro Łebsko leży tuż przy morzu, ale jest słodkowodne! Oddziela je od Bałtyku tylko wąski pas wydm. To ostoja dla kaczek, gęsi i mew.",
        "illustration": "lebsko_lake"
      },
      {
        "type": "threat",
        "title": "Ocieplenie klimatu = mniejsze ryby",
        "text": "Gdy morze jest za ciepłe, ryby odchodzą na północ. Mewy i inne ptaki morskie nie mają co jeść blisko brzegu.",
        "illustration": "threat_warming",
        "severity": "high"
      },
      {
        "type": "quiz",
        "question": "Jaki kolor ma głowa mewy śmieszki latem?",
        "answers": ["Czarny", "Biały", "Czerwony"],
        "correctIndex": 0,
        "feedbackCorrect": "Brawo! Dlatego nazywają ją 'śmieszką' — wygląda jakby miała kapelusz!",
        "feedbackWrong": "Latem mewa śmieszka ma czarną głowę — jak kapelusz!"
      }
    ]
  },
  {
    "id": "L2_S3",
    "position": { "x": 3800, "y": 350 },
    "spriteVariant": "coastal",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Latarnia w Czołpinie",
        "text": "Na wydmach stoi stara latarnia morska. Latarnik opiekował się nią dawniej całą dobę. Dziś latarnia świeci automatycznie i pomaga statkom nie rozbić się o brzeg.",
        "illustration": "czolpino_lighthouse"
      },
      {
        "type": "location",
        "title": "Wydmy wędrują",
        "text": "Wydma Łącka ma ponad 40 metrów wysokości — tyle co 13-piętrowy blok! Wiatr przenosi piasek i wydma przesuwa się nawet 10 metrów rocznie.",
        "illustration": "dune_movement"
      },
      {
        "type": "threat",
        "title": "Zadeptywanie wydm",
        "text": "Gdy ludzie chodzą po wydmach poza ścieżkami, niszczą rośliny. Bez roślin piasek zaczyna lecieć wszędzie. Dlatego trzymamy się szlaków!",
        "illustration": "threat_trampling",
        "severity": "medium"
      },
      {
        "type": "quiz",
        "question": "Dlaczego nie wolno chodzić po wydmach poza ścieżkami?",
        "answers": ["Niszczymy rośliny", "Jest za gorąco", "Możemy się zgubić"],
        "correctIndex": 0,
        "feedbackCorrect": "Dokładnie! Rośliny trzymają piasek w miejscu.",
        "feedbackWrong": "Chodzi o rośliny — gdy je niszczymy, piasek zaczyna wędrownie!"
      }
    ]
  },
  {
    "id": "L2_S4",
    "position": { "x": 5600, "y": 330 },
    "spriteVariant": "coastal",
    "pages": [
      {
        "type": "bird_fact",
        "title": "Rybitwa białoczelna",
        "text": "Rybitwa to mały biały ptak nadmorski. Gniazdo robi prosto na piasku plaży! Dlatego na plażach w parkach wyznacza się strefy tylko dla ptaków.",
        "illustration": "rybitwa_nest"
      },
      {
        "type": "location",
        "title": "Morze Bałtyckie",
        "text": "Bałtyk to jedno z najmłodszych mórz na świecie. Jest mało słony w porównaniu do oceanów — można się w nim łatwo utopić, bo jest łatwiej pływać w słonej wodzie!",
        "illustration": "baltic_map"
      },
      {
        "type": "threat",
        "title": "Hałas nad morzem",
        "text": "Morskie turbiny wiatrowe i statki wydają duże hałasy pod wodą. To przeszkadza fok i delfinom, które słyszą pod wodą zamiast widzieć.",
        "illustration": "threat_noise",
        "severity": "medium"
      },
      {
        "type": "quiz",
        "question": "Gdzie rybitwa robi gniazdo?",
        "answers": ["Prosto na piasku", "Na drzewie", "Na klifie"],
        "correctIndex": 0,
        "feedbackCorrect": "Tak! Dlatego na plażach w parkach są strefy chronione dla ptaków.",
        "feedbackWrong": "Rybitwa gniazduje prosto na piasku — bardzo odważny ptak!"
      }
    ]
  },
  {
    "id": "L2_S5_HIDDEN",
    "position": { "x": 6500, "y": 150 },
    "spriteVariant": "golden",
    "isHidden": true,
    "pages": [
      {
        "type": "bird_fact",
        "title": "Sekret: Orlik grubodzioby",
        "text": "Orlik grubodzioby to bardzo rzadki orzeł — w Polsce żyje tylko kilka par! Poluje nad jeziorami Słowińskiego Parku. Zobaczenie go to wielka przygoda dla ornitologów.",
        "illustration": "orlik_rare"
      },
      {
        "type": "quiz",
        "question": "Dlaczego orlik grubodzioby jest wyjątkowy w Polsce?",
        "answers": ["Jest bardzo rzadki", "Lata najwyżej", "Jest największy"],
        "correctIndex": 0,
        "feedbackCorrect": "Brawo detektywie! Znalazłeś jedną z najrzadszych tajemnic Słowińca!",
        "feedbackWrong": "Orlik grubodzioby jest wyjątkowy, bo jest bardzo rzadki w Polsce!"
      }
    ]
  }
]
```

## Level 3 i 4 — szkielet (do uzupełnienia)

Treści dla Level 3 (Puszcza Białowieska) i Level 4 (Tatry) należy stworzyć analogicznie, z tematami:

**Level 3 — Jesień, Białowieża:**
- S1: Dzięcioł czarny + puszcza pierwotna
- S2: Żubr (chroniony ssak) + zagrożenie: kłusownictwo  
- S3: Dąb Jagiełło + stare drzewa jako domy dla ptaków
- S4: Sowa uszatka + zagrożenie: wylesianie
- S5 (ukryta): Ryś europejski, najtrudniej ukryta

**Level 4 — Zima, Tatry:**
- S1: Puchacz + nocne polowania
- S2: Kozica tatrzańska + zmiana klimatu (brak śniegu)
- S3: Morskie Oko + TPN (Tatrzański Park Narodowy)
- S4: Płochacz halny (ptak alpejski) + zagrożenie: turystyka
- S5 (ukryta): Niedźwiedź brunatny (hibernacja)

## Legenda piór feniksa

```json
// src/data/feathers.json
[
  {
    "key": "spring_dawn",
    "name": "Pióro Wiosennego Świtu",
    "level": 1,
    "legend": "Dawno temu, gdy wiosna zapomniana była jeszcze zimą, feniks sfrunął nad Biebrzę. Jedno jego złote pióro opadło na wodę i rozbudziło bagna do życia. Mówią, że każdej wiosny bociany wracają właśnie po to, żeby podziękować.",
    "illustration": "feather_spring",
    "glowColor": "#FFD54F"
  },
  {
    "key": "summer_wind",
    "name": "Pióro Letniego Wiatru",
    "level": 2,
    "legend": "Feniks przeleciał nad Bałtykiem tak szybko, że jego skrzydła wzbudziły wiatr, który usypał pierwsze wydmy. To pióro pachnie morzem i zawsze jest lekko ciepłe w dotyku.",
    "illustration": "feather_summer",
    "glowColor": "#4DD0E1"
  },
  {
    "key": "autumn_mist",
    "name": "Pióro Jesiennej Mgły",
    "level": 3,
    "legend": "Gdy feniks przelatywał nad Puszczą Białowieską, jego pióro zatonęło w mgle. Żubry i dzięcioły strzegą go do dziś. Podobno ktoś, kto znajdzie to pióro, rozumie mowę lasu.",
    "illustration": "feather_autumn",
    "glowColor": "#FF7043"
  },
  {
    "key": "winter_aurora",
    "name": "Pióro Zimowej Zorzy",
    "level": 4,
    "legend": "Najrzadsze ze wszystkich piór. Feniks zrzucił je podczas przelotu nad Tatrami w mroźną noc. Pióro świeci jak zorza polarna i nigdy nie zamarza. Ten, kto zbierze wszystkie cztery pióra, staje się Przyjacielem Ptaków Polski.",
    "illustration": "feather_winter",
    "glowColor": "#CE93D8"
  }
]
```
