
Template.registerHelper('search_allCategory',()=>{
	     return Category.find()
})

Template.index.helpers({
  search_allRecepies:() =>{
    
    let searchval = Template.instance().search.get()

     return Template.instance().data.filter((a)=>{
       let ingredient = false;
       for(let i = 0; i<a.ingredients.length; i++){
          ingredient = ingredient || new RegExp(searchval, 'i').test(a.ingredients[i].sastojak)
       }

        return ( !searchval || ingredient || new RegExp(searchval,'i').test(a.name) || new RegExp(searchval,'i').test(a.time) || new RegExp(searchval,'i').test(a.category) || new RegExp(searchval,'i').test(a.wayoflife)  )   
     })
  }
})

Template.templateshowAdvanced.helpers({
	user: () => {
    	return Meteor.users.findOne({
    		_id: Template.instance().data.userId
    	})
  },

  recipes_likes:() => {
      let recipe = Recipes.findOne({
        _id:Template.instance().data._id
      })
      return recipe.likes.length
  },


  recipes_likes_greater_than_zero:() => {
      let recipe = Recipes.findOne({
        _id:Template.instance().data._id
      })
      return recipe.likes.length>0
  },



  comments:()=>{
    	return Comment.find({
        postid:Template.instance().data._id
      })
  },

  comment_publisher:function(){
      return Meteor.users.findOne({
        _id: this.userId
    })
  },

  is_post_publisher:function(){
    let ok = false
      if(Meteor.userId() == Template.instance().data.userId){
        return  true
      }
    return ok;
  },

  is_comment_publisher:function(){
    let ok = false
      if(Meteor.userId() == this.userId){
        return  true
      }
    return ok;
  },

  is_not_empty_advice:function(){
      let recipe = Recipes.findOne({
        _id:Template.instance().data._id
      })

      if(recipe.advice!=""){
        return true;
      }else{
        return false;
      }
  },
  is_not_empty_number:function(){
     let recipe = Recipes.findOne({
        _id:Template.instance().data._id
      })

      if(recipe.number!=""){
        return true;
      }else{
        return false;
      }
  }
})



