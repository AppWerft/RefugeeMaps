var texts = {
	yourposition : {
		arabic : 'موقعك',
		albanian : 'Pozicioni juaj',
		persian : 'جایگاه تو',
		english : 'Your position',
		german : 'Dein Standort'
	},
	religion : {
		arabic : 'دين',
		albanian : 'Fe',
		persian : 'دین',
		english : 'Religion',
		german : 'Religion'
	},
	finance : {
		arabic : 'تمويل',
		albanian : 'Financat',
		persian : 'امور مالی',
		english : 'Finance',
		german : 'Finanzen'
	},
	communication : {
		arabic : 'الاتصالات',
		albanian : 'Komunikim',
		persian : 'ارتباطات',
		english : 'Communication',
		german : 'Kommunikation'
	},
	store : {
		arabic : 'تخزين',
		albanian : 'Dyqan',
		persian : 'فروشگاه',
		english : 'Store',
		german : 'Läden'
	},
	health : {
		arabic : 'الصحة',
		albanian : 'Shëndetësor',
		persian : 'سلامت',
		english : 'Health',
		german : 'Gesundheit'
	},
	kids : {
		arabic : 'الأطفال',
		albanian : 'Fëmijë',
		persian : 'بچه ها',
		english : 'Kids',
		german : 'Kinder'
	},
	park : {
		arabic : 'منتزه',
		albanian : 'Park',
		persian : 'پارک',
		english : 'Park',
		german : 'Park'
	},
	cafe : {
		arabic : 'مقهى',
		albanian : 'Kafene',
		persian : 'کافه',
		english : 'Cafe',
		german : 'Cafés'
	},
	authorities : {
		arabic : 'سلطات',
		albanian : 'Autoritetet',
		persian : 'مسئولین',
		english : 'Authorities',
		german : 'Behörden'
	},
	culture : {
		arabic : 'ثقافة',
		albanian : 'Kulturë',
		persian : 'فرهنگ',
		english : 'Culture',
		german : 'Kultur'
	},
	restrooms : {
		arabic : 'دستشویی',
		albanian : 'Vc',
		persian : 'دستشویی',
		english : 'Restrooms',
		german : 'Toiletten'
	},
	freewifi : {
		arabic : 'واى فاى مجانى',
		albanian : 'WiFi pa pagesë',
		persian : 'وای فای رایگان',
		english : 'Free WiFi',
		german : 'freies WLAN'
	},
	languagechanged : {
		arabic :'تغيرت لغة',
		albanian : 'Gjuha ndryshuar',
		persian: 'زبان تغیی',
		english : 'Language changed',
		german : 'Sprache gewechselt'
	},
	yourposition : {
		arabic :'تحديد الوظيفة',
		albanian : 'Definimi i pozitës',
		persian:'تعریف موقعیت',
		english : 'Your position',
		german : 'Dein Standort'
	}
};

module.exports = function(k) {
	var lang = Ti.App.Properties.getString('CURRENTLANG', 'english');
	return texts[k] ? texts[k][lang] : '';
};

