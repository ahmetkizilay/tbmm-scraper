### tbmm-scraper

tbmm.gov.tr uzerinden veri kazima uygulamalari. Indirilen veriler Graph Commons'a import edilmek uzere
csv dosyalarina cevrilir.

#### kurulum
`npm install`

#### kullanim
meclis dizini altinda doneme milletvekili listeleri ve profillerini kaziyan metodlar bulunmaktadir. Graph Commons'a uygun node ve edge csv dosyalari olusturulur.

ktii dizini altinda her milletvekili profili uzerinden ilk imzasina sahip oldugu kanun tekliflerini kaziyan metodlar bulunur.

kt-detay dizini altinda ktii dizininde hazirlanan json dosyalari kullanilarak kanun teklifleri detaylari kazinir. Graph Commons icin import csv dosyalari hazirlanir.

Her js dosyasinin basinda daha ayrintili bilgiler mevcuttur.

### veri modeli
![model diyagrami](https://github.com/artsince/tbmm-scraper/blob/master/tbmm_model.png)

#### ornek komut sirasi
23\. donem bilgilerini indirmek icin:

genel meclis milletvekili ve parti bilgilerini almak icin:

```node meclis/donem-parser.js --donem 23 --dest data/donem.23.json```

milletvekili biyografilerini cekmek icin:

```node meclis/mv-parse-all.js --file data/donem.23.json --donem 23 --dest data/donem-ext.23.json```

Graph Commons import icin node csv dosyasini olusturmak icin

```node meclis/meclis-nodes.js --file data/donem-ext.23.json --dest data/meclis-nodes.23.csv --donem 23 --donem_baslangic 23/07/2007 --donem_bitis 28/06/2011```

Graph Commons import icin edge csv dosyasini olusturmak icin:

```node meclis/meclis-rels.js --file data/donem-ext.23.json --dest data/meclis-rels.23.csv --donem 23 --donem_baslangic 23/07/2007 --donem_bitis 28/06/2011```

her milletvekili icin ilk imzasini attigi kanun teklifi bilgileri icin:

```node ktii/parse-all.js --file data/donem-ext.23.json --destII data/ii.23.json --destMV data/donem-ext.23.json --donem 23```

kanun teklifi detay sayfalarini indirmek icin: (oncesinde `mkdir data/kt-detay-23`)

```node kt-detay/download-all.js --file data/ii.23.json --dest data/kt-detay-23/ --donem 23```

kanun detaylarini ayiklamak icin:

```node kt-detay/parse-all.js --file data/ii.23.json --dest data/kt.23.json --contentDir data/kt-detay-23/```

kanun detaylarini Graph Commons'a import etmek icin node csv olustumak icin:

```node kt-detay/kt-nodes.js --file data/kt.23.json --dest data/kt-nodes.23.csv --donem 23```

kaun detaylarini Graph Commons'a import etmek icin edge csv olusturmak icin:

```node kt-detay/kt-rels.js --file data/kt.23.json --dest data/kt-rels.23.csv --donem 23 --donem_baslangic 23/07/2007 --donem_bitis 28/06/2011```



#### lisans
`MIT`
