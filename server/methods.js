Meteor.methods({
	
	addRecipes:(name, time, category, difficulty, number, wayoflife, picture, ingredients, preparation, advice) =>{
		return Recipes.insert({name:name, time:time, category:category, difficulty:difficulty, number:number, wayoflife:wayoflife, picture:picture, ingredients:ingredients, preparation:preparation, advice:advice,  createdAt:new Date(),  userId:Meteor.userId()})
	},

	deleteRecipes:(postid)=>{
		let post = Recipes.findOne({
			_id:postid
		})
		if((Meteor.userId() === post.userId)){
			return Recipes.remove(postid);
		}
	},

	'like':(post)=>{
		let recipe = Recipes.findOne({_id:post})
		if((recipe.likes || []).indexOf(Meteor.userId()) !== -1){
			Recipes.update({
				_id:post
			},{
				$pull:{
					'likes':Meteor.userId()
				}
			})
		}else{
			Recipes.update({
				_id:post
			},{
				$push:{
					'likes':Meteor.userId()
				}
			})
		}
	},

	addComment:(comment,postid)=>{
		return Comment.insert({comment:comment, postid:postid, createdAt:new Date(), userId:Meteor.userId()})
	},
	updateComment:function(updatecommentid,newcommentvalue){
		let comment = Comment.findOne({_id:updatecommentid})
		if(comment.userId===Meteor.userId()){
			Comment.update(updatecommentid, {$set:{'comment':newcommentvalue}})
		}
	},
	removeComment:function(deletecommentid){
		let comment = Comment.findOne({_id:deletecommentid})
		if(comment.userId===Meteor.userId()){
		   return Comment.remove({_id:deletecommentid})
		}
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

