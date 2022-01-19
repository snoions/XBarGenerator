class Term {
	constructor(type, word){
		this.type = type;
		this.word = word;
	}
	toString(){
		if(this.isSilent())
			return "";
		return this.word;
	}
	toJSON(){
		return {[this.type]: this.word}
	}
	toTreantJSON(){
		return {text: {name: this.type} , children:[{text: {name: this.word } } ] };
	}
	isSilent(){
		return /\[.*\]/g.test(this.word);
	}
};

class Phrase {
	constructor(type, children){
		this.type = type;
		this.children = children||[];

	}
	addChild(child){
		this.children.push(child);
	}
	toString(){
		let s= "";
		for(let i=0;i<this.children.length; i++){
			s+=this.children[i].toString()+" ";
		}
		return s.trim();
	}
	toJSON(){
		let children = {}
		for(let i=0;i<this.children.length; i++){
			children[this.children[i].type] = this.children[i].toJSON()[this.children[i].type];
		}
		return {[this.type]: children};
	}
	toTreantJSON(){
		let children = []
		for(let i=0;i<this.children.length; i++){
			let child = this.children[i].toTreantJSON();
			children.push(child)
		}
		return { text: {name: this.type}, children: children};
	}
};

class Word{
	constructor(name, subcat, prob){
		this.name = name
		this.subcat = subcat || []
		this.prob = prob
	}
}

class LexicalRule{
	constructor (name, lexicon){
		this.name = name;
		this.lexicon = lexicon;
	}
	pickWord(){
		let pick = randomPick(this.lexicon);
		while(pick.prob && Math.random()>pick.prob){
			pick = randomPick(this.lexicon);
		}
		return pick;
	}
}


class PhraseRule{

	constructor(name, expansion, subcat, adjnProb){
		this.name = name;
		if(!expansion || !expansion.head)
			console.log("illegal phrase rule "+ name + " : no head");
		this.expansion = expansion;
		if(!expansion.head instanceof Term)
			console.log("illegal phrase rule "+ name + " : head is not a terminal");
		this.expansion.comp = expansion.comp ||[];
		this.expansion.adjnR = expansion.adjnR ||[];
		this.expansion.adjnL = expansion.adjnL ||[];
		this.subcat = subcat;
		this.adjnProb = adjnProb||0.2;
	}
	subcategorize(subcatList){
		let newExp = JSON.parse(JSON.stringify(this.expansion));
		let subcatDefs = this.subcat;
		subcatList.forEach( subcat => {
			if(!subcatDefs || !subcatDefs[subcat])
				console.log("subcatgory "+subcat + " not defined for "+ headWord)
			if(subcatDefs[subcat]['spec']!==undefined){
				newExp['spec'] = subcatDefs[subcat]['spec'];
			}
			if(subcatDefs[subcat]['comp']!==undefined)
				newExp['comp'] = subcatDefs[subcat]['comp'];
		});
		return newExp;
	}

	build(){
		//console.log("building "+this.name)
		let barName = addBar(this.name);
		let headType = this.expansion.head;
		//console.log("lexicon "+ JSON.stringify(words[headType]['lexicon']));
		let headWordEnrty = lexicalRules[headType].pickWord();
		let curNode = new Term(headType, headWordEnrty.name);
		let expansion = this.subcategorize(headWordEnrty.subcat)
		//console.log("expansion: "+JSON.stringify(expansion));

		curNode = new Phrase(this.name, [curNode]);
		for(let i=0;i<expansion.comp.length;i++){
			let compType = expansion.comp[i];
			curNode.addChild(build(compType));
		}

		if(expansion.spec){
			curNode.type = barName
			let specType = expansion.spec;
			curNode = new Phrase(this.name, [build(specType), curNode])
		}

		for(let i=0;i<expansion.adjnL.length;i++){
			let prob = this.adjnProb;
			while(Math.random()<prob){
				let adjnType =expansion.adjnL[i];
				curNode = new Phrase(this.name, [build(adjnType), curNode])
				prob/=2;
			}
		}

		for(let i=0;i<expansion.adjnR.length;i++){
			let prob = this.adjnProb;
			while(Math.random()<prob){
				let adjnType =expansion.adjnR[i];
				curNode = new Phrase(this.name, [curNode, build(adjnType)])
				prob/=2;
			}
		}

		return curNode;

	}
}

function addBar(s){
	let sbar = "";
	for(let i =0;i<s.length-1;i++)
		sbar += s.charAt(i) + "\u035E";
	sbar+= s.charAt(s.length-1);
	return sbar;
}
function build(ruleName){
	if(lexicalRules[ruleName]){
		return new Term(ruleName, lexicalRules[ruleName].pickWord().name);
	}
	if(phraseRules[ruleName]){
		return phraseRules[ruleName].build();
	}
	console.log("rule for "+ ruleName + " does not exist");
}





function randomPick(array){
	return array[Math.floor(Math.random() * array.length)];
}

function clearTable(){
	$("#sTableBody").html('');
	console.log("Table cleared")
}

var counter =1;

function buildTreant(nodeStructure){
	simple_chart_config = {
	    chart: {
	        container: "#tree-simple",
	        levelSeparation:    25,
	        siblingSeparation:  70,
	        subTeeSeparation:   70,
	        scrollbar: "fancy",
	        padding: 35,
	    },
	    
	    nodeStructure: nodeStructure
	};
	return new Treant(simple_chart_config);
}
function xbar(){
	var start = phraseRules["TP"];
	var expansion = start.build();
	let sentence = expansion.toString();
	let bareJSON = JSON.stringify(expansion.toJSON());
	let TreantJson = JSON.stringify(expansion.toTreantJSON());
	buildTreant(expansion.toTreantJSON());
	$("#sTableBody").append(`<tr>
						      <th scope="row">`+ counter + `</th>
						      <td>`+ sentence + `</td>
						      <td>`+ bareJSON + `</td>
						    </tr>`);
	counter++;
	
	//console.log("String: "+ sentence);
	//console.log("JSON: "+ bareJSON);
	console.log("TreantJSON: "+ TreantJson);
	
}