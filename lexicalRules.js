var lexicalRules = {
	T: new LexicalRule( "T", 	[
									new Word("[pres]")
								]
						),
	D: new LexicalRule( "D", 	[
									new Word("\'s", [], 0.3),
								 	new Word("the",["noSpec"]),
								 	new Word("a",["noSpec"])
								]
						),
	N: new LexicalRule( "N", 	[
									new Word("shark"), 
									new Word("whale")
								]
						),
	V: new LexicalRule( "V", 	[
									new Word("devours", ['DPComp']),
									new Word("swallows", ['DPComp']), 
									new Word("chases", ['noComp']), 
									new Word ("sees", ['noComp'])
								]
						),
	A: new LexicalRule( "A", [
									new Word("hungry"),
									new Word("desperate"), 
									new Word("heavy"), 
									new Word("daunting")
							   ]
						),
	P: new LexicalRule( "P", [
									new Word("above"),
									new Word("below"), 
									new Word("behind"),
									new Word("in front of")
								]
						),
}