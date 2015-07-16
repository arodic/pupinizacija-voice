/*
 * Cyrillic to Latin and vice versa converter
 *
 *  - ignoreListIncludeUnicode : if list for ignoring transliteration contains Cyrillic words, set this to 'on', otherwise to 'off'
 *                                  (off has small performance gain). Default is 'on'
 *
 * ************************************************************************************
 * This software is free to use for personal, company internal or commercial purposes.
 *
 * You may not resell this software, and attribution to the author must remain.
 * Backlink is desirable, you can show backlink to the:
 * www.ivebe.com
 * or
 * www.ivebe.com/blog/cyrillic-to-latin-and-latin-to-cyrillic-jquery-plugin.html
 * ************************************************************************************
 *
 * Copyright [2014] [Danijel Petrovic]
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 * @author Danijel Petrovic
 * @copyright Danijel Petrovic, www.ivebe.com, 2014
 * @version 0.6.1
 */

	var config = {
		ignoreListIncludeUnicode : 'on',
	};

	var Lat2Cyr = {
		'a' : 'а',
		'b' : 'б',
		'c' : 'ц',
		'd' : 'д',
		'e' : 'е',
		'f' : 'ф',
		'g' : 'г',
		'h' : 'х',
		'i' : 'и',
		'j' : 'ј',
		'k' : 'к',
		'l' : 'л',
		'm' : 'м',
		'n' : 'н',
		'o' : 'о',
		'p' : 'п',
		'q' : '',
		'r' : 'р',
		's' : 'с',
		't' : 'т',
		'u' : 'у',
		'v' : 'в',
		'w' : '',
		'x' : '',
		'y' : '',
		'z' : 'з',

		'A' : 'А',
		'B' : 'Б',
		'C' : 'Ц',
		'D' : 'Д',
		'E' : 'Е',
		'F' : 'Ф',
		'G' : 'Г',
		'H' : 'Х',
		'I' : 'И',
		'J' : 'Ј',
		'K' : 'К',
		'L' : 'Л',
		'M' : 'М',
		'N' : 'Н',
		'O' : 'О',
		'P' : 'П',
		'Q' : '',
		'R' : 'Р',
		'S' : 'С',
		'T' : 'Т',
		'U' : 'У',
		'V' : 'В',
		'W' : '',
		'X' : '',
		'Y' : '',
		'Z' : 'З',

		'č' : 'ч',
		'ć' : 'ћ',
		'đ' : 'ђ',
		'ž' : 'ж',
		'š' : 'ш',

		'Č' : 'Ч',
		'Ć' : 'Ћ',
		'Đ' : 'Ђ',
		'Ž' : 'Ж',
		'Š' : 'Ш'
	};

	var lat2CyrChained = {
		'l' : {
			'j' : 'љ'
		},
		'n' : {
			'j' : 'њ'
		},
		'd' : {
			'j' : 'ђ',
			'z' : 'џ',
			'ž' : 'џ'
		},
		'L' : {
			'j' : 'Љ',
			'J' : 'Љ'
		},
		'N' : {
			'j' : 'Њ',
			'J' : 'Њ'
		},
		'D' : {
			'j' : 'Ђ',
			'J' : 'Ђ',
			'z' : 'Џ',
			'Z' : 'Џ',
			'ž' : 'Џ',
			'Ž' : 'Џ'
		}
	};

	/*
	 * Cyrillic to Latin and vice versa converter - ignore list
	 *
	 * NOTE: all keys in both arrays MUST be lowercase!
	 *
	 * /// CyrLatIgnore: ///
	 *     KEY: lowercase word to ignore, as in page it will ignore it regardless of is it lower, upper or mixed case.
	 *  VALUE: if value is set, word will be replaced with the value, if value empty, original word with original case will be preserved
	 *
	 * /// cyrLatIgnoreDoubleletters: ///
	 * 	  KEY: lowercase word to ignore double letters chaining. Ex. Nj => Њ by default, here you can specify words which ignore this behavior
	 *  VALUE: always empty
	 *
	 * /// cyrLatIgnoreDoublelettersBase: ///
	 * 	  KEY: lowercase BASE word to ignore double letters chaining. Ex. Nj => Њ by default, here you can specify words which ignore this behavior. All words that contains base word will be ignored from double letters chaining.
	 *  VALUE: always empty
	 *
	 *
	 * ************************************************************************************
	 * This software is free to use for personal, company internal or commercial purposes.
	 *
	 * You may not resell this software, and attribution to the author must remain.
	 * Backlink is desirable, you can show backlink to the:
	 * www.ivebe.com
	 * or
	 * www.ivebe.com/blog/cyrillic-to-latin-and-latin-to-cyrillic-jquery-plugin.html
	 * ************************************************************************************
	 *
	 * Copyright [2014] [Danijel Petrovic]
	 *
	 * Licensed under the Apache License, Version 2.0 (the 'License');
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *        http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an 'AS IS' BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 *
	 *
	 * @author Danijel Petrovic
	 * @copyright Danijel Petrovic, www.ivebe.com, 2014
	 * @version 0.5.4
	 */


	//ignore exact words, and if value set, replace it with value
	var cyrLatIgnoreList = {
		'plugin' : '',
		'jquery' : 'jQuery',
		'default' : '',
		'copyright' : '',
		'trademark' : '',
		'web' : '',
		'browser' : '',
		'javascript' : '',
		'microsoft' : 'Microsoft',
		'firefox' : 'Firefox',
		'opera' : 'Opera',
		'safari' : 'Safari',
		'chrome' : 'Chrome',
		'ie' : 'IE',
		'download' : '',
		'windows' : '',
		'linux' : '',
		'office' : '',
	 	'cookie' : '',
	 	'cyrlatconverter' : '',
	 	'cyrlatconvert' : '',
	 	'cyrlatignore' : ''
	};

	//ignore EXACT words from double letters chaining into one
	var cyrLatIgnoreDoubleletters = {
		'OVDE-UNETI-TAČNU-REČ-ZA-IGNORISANJE-SPAJANJA-DVA-SLOVA-U-JEDNO' : '',
		'njemačku' : ''
	};

	//ignore all words BASED on words in the list from double letters chaining into one
	var cyrLatIgnoreDoublelettersBase = {
		anjon		: '',
		adjektiv	: '',
		adjunkt		: '',
		budzašto	: '',
		vanjezič	: '',
		injekt		: '',
		injekc		: '',
		konjug		: '',
		konjunk		: '',
		lindzi		: '',
		nadždrel	: '',
		nadžet		: '',
		nadžive		: '',
		nadživ		: '',
		nadžnje		: '',
		nadžup		: '',
		nadzemn		: '',
		nadzida		: '',
		nadzira		: '',
		nadzire		: '',
		nadziru		: '',
		nadzor		: '',
		nadjača		: '',
		nadjaha		: '',
		odžali		: '',
		odžari		: '',
		odžvaka		: '',
		odžubor		: '',
		odžive		: '',
		odživlj		: '',
		odzvanja	: '',
		odzvoni		: '',
		odziv		: '',
		odjav		: '',
		odjaha		: '',
		odjaš		: '',
		odjeb		: '',
		odjedri		: '',
		odjezdi		: '',
		odjedanput	: '',
		odjedared	: '',
		odjednom	: '',
		odjek		: '',
		odjeci		: '',
		odjur		: '',
		podžanr		: '',
		podzadat	: '',
		podzakon	: '',
		podzemlj	: '',
		podzemn		: '',
		podzida		: '',
		podznak		: '',
		podznaci	: '',
		podjar		: '',
		podjamči	: '',
		podjezič	: '',
		podjednak	: '',
		predživot	: '',
		predželuda	: '',
		predzadnj	: '',
		predznak	: '',
		predznanj	: '',
		predznaci	: '',
		predjel		: '',
		tanjug		: ''
	};

	/**
	 * splitWords
	 *
	 * Cross browser function to split words and preserve delimiters.
	 */
	function splitWords(str) {

		var pattern;
    if(config.ignoreListIncludeUnicode === 'on'){
		  pattern = '[^0-9a-zA-Z\u0400-\u04FF_\u010D\u010C\u0107\u0106\u017E\u017D\u0161\u0160\u0111\u0110]+'; //unicode for all cyrillic letters, and čČćĆžŽšŠđĐ
		} else {
			pattern = '[^0-9a-zA-Z_\u010D\u010C\u0107\u0106\u017E\u017D\u0161\u0160\u0111\u0110]+'; //unicode for čČćĆžŽšŠđĐ
		}

		//test does browser natively support split with keeping delimiters.
		var test = 'test string';
		if(test.split(/([^a-z])/).length === 3)
		{
			return str.split(new RegExp('(' + pattern + ')', 'i'));
		}

		var regex = new RegExp(pattern, 'gi');

		var i = 0;
		var matches    = str.split(regex),
	        separators = str.match(regex),
	        ret        = [];

		if(matches.length === 0) {
			return separators;
		}

		if(separators === null) {
			return matches;
		}

		if(separators.length === matches.length + 1) //separators from both sides
		{
			for(i = 0; i < matches.length; i++)
			{
				ret.push(separators[i]);
				ret.push(matches[i]);
			}
			ret.push(separators[i]);
		}
		else if(separators.length === matches.length) //separator from one of the sides
		{
			if(matches[0].indexOf(separators[0]) > -1) //separator is 1st
			{
				for(i = 0; i < separators.length; i++)
				{
					ret.push(separators[i]);
					ret.push(matches[i]);
				}
			}
			else //separator is last
			{
				for(i = 0; i < separators.length; i++)
				{
					ret.push(matches[i]);
					ret.push(separators[i]);
				}
			}
		}
		else //no separators from the sides
		{
			ret.push(matches[0]);
			for(i = 0; i < separators.length; i++)
			{
				ret.push(separators[i]);
				ret.push(matches[i+1]);
			}
		}

	    return ret;
	}
	/* End of splitWords */

	function forEach(obj, callback) {
		for (var i in obj) {
			callback(i, obj[i]);
		}
	}

	function replaceL2C(txt) {
		var value;
		var chainedFlag;
		var c2;
		var validDoubleChain;

		var words = splitWords(txt);

		//iterate through all words
		forEach(words, function(i, w) {

			//if list of words to ifnore exist...
			if((typeof cyrLatIgnoreList !== 'undefined') && (w.toString().toLowerCase() in cyrLatIgnoreList)) {
				words[i] = cyrLatIgnoreList[w.toString().toLowerCase()] === '' ? w : cyrLatIgnoreList[w.toString().toLowerCase()];
			} else {
				validDoubleChain = true;

				if(typeof cyrLatIgnoreDoubleletters !== 'undefined' && (w.toString().toLowerCase() in cyrLatIgnoreDoubleletters)) {
					validDoubleChain = false;
				}

				//iterate through list of base words to ignore
				if(typeof cyrLatIgnoreDoublelettersBase !== 'undefined') {
					forEach(cyrLatIgnoreDoublelettersBase, function(base) {
						if(w.toString().toLowerCase().indexOf(base) > -1) //ignore it
						{
							validDoubleChain = false;
							return false;
						}

					});
				}

				//split words in letters...
				value = w.split('');

				forEach(value, function(i, c) {
					chainedFlag = false;

					//if word shoult be doubleletters chained...
					if (lat2CyrChained[c] && validDoubleChain) {
						c2 = value[Number(i) + 1];
						if (c2 && lat2CyrChained[c][c2]) {
							value[Number(i)] = lat2CyrChained[c][c2];
							value[Number(i) + 1] = '';
							chainedFlag = true;
						}
					}

					if (!chainedFlag) {
						value[Number(i)] = (Lat2Cyr[c] && Lat2Cyr[c] !== '') ? Lat2Cyr[c] : c;
					}
				});

				words[Number(i)] = value.join('');
			}

		});

		return words.join(''); //join with NO space, as spaces are preserved in split function.
	}
