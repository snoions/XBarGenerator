var phraseRules = {
	TP: new PhraseRule("TP",
				{
						"spec": "DP",
						"head": "T",
						"comp": ["VP"],
				},
				{

				}

		),
	VP: new PhraseRule( "VP", 
				{
					"head": "V",
					"comp": ["DP", "AP", "PP"],
					"adjnR": ["PP"],
				},
				{
					"DPComp":{"comp":["DP"]},
					"noComp":{"comp":[]}
				}
		),
	DP: new PhraseRule( "DP", 
				{
					"spec":"DP",
	    			"head": "D",
	    			"comp": ["NP"]
				},
				{
					"noSpec":{"spec":null}
				}
		 ),
    NP: new PhraseRule ("NP",
				{
					"adjnL": ["AP"],
					"head": "N",
					"adjnR": ["PP"]
				},
    	  ),
    AP: new PhraseRule ("AP",
				{
					"head": "A"
				},
		  ), 
	PP: new PhraseRule ("PP", 
				{
					"head": "P",
					"comp": ["DP"]
				}
		  ),
};