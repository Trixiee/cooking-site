

Router.route("/", {
	name: "/",
	action: function(){
		this.render("index",{
			data:()=>{
				return Recipes.find().fetch()
			}
		})
	}
}) 

Router.route("/registracija", {
	name: "registracija",
	action: function(){
		this.render("templateRegister")
	}
})


Router.route("/prijava", {
	name: "prijava",
	action: function(){
		this.render("templateLogin")
	}
})


Router.route("/dodajte_recept", {
	name: "dodajte_recept",
	action: function(){
		this.render("templateAddRecepties")
	}
})


Router.route("/izmenite_recept", {
	name: "izmenite_recept",
	action: function(){
		this.render("templatechangeReceptie")
	}
})

Router.route("/recept/:id", {
	name: "recept",
	action: function(){
		this.render("templateshowAdvanced")
	},
	data:function(){
		return Recipes.findOne(this.params.id);
	}
	
})

Router.route("/:cat", {
	name: "index",
	action: function(){
		this.render("index", {
			data: () => Recipes.find({
				category: this.params.cat
			}).fetch()
		})
	}
})



