Meteor.methods({
	addRecipes:(name, time, category, difficulty, number, wayoflife, picture, ingredients, preparation, advice) =>{
		return Recipes.insert({name:name, time:time, category:category, difficulty:difficulty, number:number, wayoflife:wayoflife, picture:picture, ingredients:ingredients, preparation:preparation, advice:advice,createdAt:new Date(),  userId:Meteor.userId()})
	},

	deleteRecipes:(postid)=>{
		let post = Recipes.findOne({
			_id:postid
		})
		if((Meteor.userId() === post.userId))
			return Recipes.remove(postid);

	},

	addComment:(comment,postid)=>{
		return Comment.insert({comment:comment, postid:postid, createdAt:new Date(), userId:Meteor.userId()})
	},
	updateComment:function(updatecommentid,newcommentvalue){
		Comment.update(updatecommentid, {$set:{'comment':newcommentvalue}})
	},
	removeComment:function(deletecommentid){
		return Comment.remove({_id:deletecommentid})
	},




	updateProfileName:(newname) => {
		Meteor.users.update({
			_id: Meteor.userId()
		}, {
			$set:{
				'profile.name':newname
			}
		})
	}
})

