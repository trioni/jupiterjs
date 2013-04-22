# JupiterJS

En projektmall för modulbaserade js-projekt.

---

## I korthet
Projektets struktur grundar sig på [AMD](http://requirejs.org/docs/whyamd.html) och RequireJS [packages](http://requirejs.org/docs/api.html#packages). Strukturen har i dagsläget endast kopplingar till jQuery och underscore, vilka med lätthet kan abstraheteras bort. Mallen innehåller inga basvyer. Däremot några tillägg till String.prototype. Bland annat för att ta rensa en text från html-element via `stripTags` eller generera friendlyUrls via `toFriendlyUrl`.

### På det stora hela
Använd packages för att gruppera komponenter eller moduler som utgör en komposit delmängd av en applikation.

I DOM:en ligger till en början bara en (1) script-referens i `head`

`<script type="text/javascript" data-main="/src/Bootstrapper" src="/src/vendor/require/require.js"></script>`

`Require` instrueras att ladda in `Bootstrapper`, vars enda uppgift är att lyssna på `document.ready` för att därefter börja ladda packages. För att ange vilka packages som ska laddas på en sida, ange `data-package="mittpaket"` på ett valfritt element. Paketen behöver nödvändigtvis inte mappa mot elementet. Vill man ange flera paket i ett och samma attribut kan man pipe `|` separera paketen: `data-package="mittpaket|dittpaket"`.

### Varför packages?
- Ger tydlig struktur.
- Uppmuntrar till en event-driven arkitektur.
- Underlättar path-hantering avsevärt när man ska referera till beroenden i sina moduler. Mer om [beroendedeklarering](#package-dependencies).

---

## Beroenden
- [Node](http://nodejs.org/) 0.8.x +
- [Grunt](http://gruntjs.com/) 0.4.x +

## Kom igång
När node och grunt är installerat, behöver några Grunt tasks instralleras för att underlätta arbetsflödet. Kör:

```$
npm install
```

En mapp `node_modules` kommer att skapas i projektmappens root i vilken alla plugins kommer installeras i.

### Grunt plugins
- **grunt-init**: Scaffolding-verktyg.
- **grunt-contrib-watch**: För att övervaka filer och köra kommandon för att kompilera templates eller köra tester.
- **grunt-contrib-jst**: För att kompilera [Underscore](underscorejs.org) templates.
- **grunt-contrib-requirejs**: För att bygga projektet. Pluginet kör Requirejs egna byggscript r.js under huven men ger bättre output och bidrar till en mer samlad konfiguration.

---

## Packages
Alla packages måste ha en `main.js`. Det enda filen **måste** innehålla är en initialize-function. Funktionen kan göra vad som helst eller ingenting, men behöver finnas där. Vid applikationsuppstart registreras varje pakets initialize-function hos applikationsobjektet och körs vid `App.start()`.

Packges registreras i `config.js` för att underlätta lookup. Döp paketen till samma som dess folder. Använd bara lowercase för allt som registreras i `config.js`, både under `paths` och `packages`.

### <a id="package-dependencies">Package dependencies</a>
Genom att i `config.js` ha registrerat sina paket kan man oberoende av relativ sökväg till paketet bara referera till det registrerade paketets namn. Så istället för t.ex:
`"../../mittpaket"` blir sökvägen till beroendet kort och gott `"mittpaket"`

Inom paketet referear man till filer som ligger på samma nivå som filen man jobbar i genom `"./MittBeroende"`. Eller en fil en undermapp `"../MittBeroende"

Till en specifik modul i ett externt paket `"annatpaket/SuperView"`

[Referens till Require packages](http://requirejs.org/docs/api.html#packages)

## <a id="underscore-templates">Underscore templates</a>
Lägg med fördel alla templates i `mittpaket/templates`. Att kompilera templates i klienten är en tungt, varför förkompilerade templates är att föredra.

### Kompilera templates
Kompilera projektets alla templates:
`grunt jst`

Kompilera templates för ett enskilt paket:
`grunt jst:mittpaket`

Kompilering av templates resulterar i en funktion som man anropar med det dataobjekt som ska visas.

`mycompiledTemplate({ Name: "Foo", Surname: "Bar"})`.

Samtliga templates i ett paket hamnar i en separat AMD-modul vid namn `templates.js` som hamnar i paketets rootmapp.

Referera till en template i samma paket:
```js
define(['./templates'], function( templates ){
    templates.mintemplate
});
```

Nyckeln på template-objektet är detsamma som templatenfilens namn före första punkten. `mintemplate.html` ger alltså `mintemplate`

### TemplateHelpers
Ibland kan det finnas behov av att gör enklare uträkningar i en template t.ex. för att sätta dynamiska klassnamn såsom 'odd', 'even'. Detta görs med templateHelpers. Hur man tillgängliggör dessa i sina templates beror lite på tycke och smak. Eftersom godtycklig javascript kan köras i en underscore-template kan man enkelt extenda dataobjektet med sina hjälpfunktioner. [Marionette tar hand om processen åt dig](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.view.md#viewtemplatehelpers)


### Ful syntax?
Gillar du inte syntaxen? Föredrar du Mustache syntax? Se [templatesetting](http://underscorejs.org/#template) för att interpolera.