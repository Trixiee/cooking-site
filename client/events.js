Template.body.onCreated(function() {
	$(window).on('scroll', (event) => {
		$('.up-button').toggle($(document).scrollTop() > 55)
	})
})

Template.body.events({
	'click .password':function(event){
		let id=$(event.currentTarget).attr('id')
		if($('#'+id+'-password').attr('type')=='password'){
			$('#'+id+'-password').attr('type','text')
		}else{
			$('#'+id+'-password').attr('type','password')
		}
	},
	'click .up-button':()=>{
		document.body.scrollTop = 0; 
		document.documentElement.scrollTop = 0;
	}
})

Template.index.onCreated(function() {
	this.search=new ReactiveVar("")
})


Template.index.events({
	'change #search-input':(event, templateInstance)=>{
		event.preventDefault()
		let searchvalue = $('#search-input').val()
		templateInstance.search.set(searchvalue)

	}
})

Template.templateLogin.events({
	'submit .login-form':(event, templateInstance) => {
		event.preventDefault();
		let email = $('#login-email').val();
		let password = $('#login-password').val();
		
		Meteor.loginWithPassword(email,password,(error,data) => {
			if(!error){
				Router.go('/')
			}else{
				alert(error.reason)
			}  
		})
	}	
})


Template.templateRegister.events({
	'submit .register-form': (event, templateInstance) => {
		event.preventDefault()
		isEmailValid=function(email) {
			const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}
		let username = $('#register-username').val()
		let password = $('#register-password').val()
		let email = $('#register-email').val()
		let testemail = isEmailValid(email) 
		if(testemail){
			Accounts.createUser({
				email:email,
				password:password,
				profile:{
					name:username
				}
			}, (error,data)=>{
				if(!error){
					Router.go('/')
				}else{
					alert(error.reason)
				}
			})
		}else{
			alert("Neispravan email !")
		}
	},

})


Template.templateHeader.events({
	'click #log-out':()=>{
		Meteor.logout(()=>{
			Router.go('/')
		})
	},

	'click #change-profile-name':() =>{
		$('#username-modal').toggle();

	},

	'click #change-profile-password':() =>{
		$('#password-modal').toggle();
	},

	'click .close,.confirm-close':()=>{
		let username_modal_is_toogled = $( "#username-modal" ).is( ":visible" )
		let password_modal_is_toogled = $( "#password-modal" ).is( ":visible" )
		
		if(username_modal_is_toogled){
			
			$('#username-modal').toggle();	
		}
		if(password_modal_is_toogled){
			$('#password-modal').toggle();
		}
	},

	'click #confirm-profile-name-change':(event)=>{
		event.preventDefault()
		let newusername = $("#new-user-name").val()
		Meteor.call("updateProfileName",newusername)
	},

	'click #confirm-profile-password-change':(event)=>{
		event.preventDefault()
		let oldPassword = $('#old-password').val()
		let newPassword = $('#new-password').val()
		let confirmPassword = $('#confirm-password').val()
		if(newPassword==confirmPassword)
			Accounts.changePassword(oldPassword, newPassword, (error,data)=>{
				if(!error){
					Router.go('home')
				}else{
					alert(error.reason)
				}  
			})
		$('#password-modal').hide(); 
	}
})



Template.templateAddRecipes.onCreated(function() {
	this.recipes_picture=new ReactiveVar("")
	this.difficulty=new ReactiveVar("")
	this.category=new ReactiveVar("")
})

Template.templateAddRecipes.events({
	
	'change #file-upload': (event, templateInstance) => {
		event.preventDefault()
		let file = $('#picture-form').find('input[type="file"]')[0].files[0] 
		if ( file && !file.type.match('image.*') ) return alert('Upload must be an image')
			let rd = new FileReader()

		const uint8ToString = (buffer) => {
			let length = buffer.length
			let str = ''

			for (let i = 0; i < length; i++) {
				str += String.fromCharCode(buffer[i])
			}

			return str
		}

		rd.onload = (e) => {  
			$('#loader').attr('src','loading.gif');
			Imgur.upload({
				apiKey: '6affe5109b110b2',
				image: btoa(uint8ToString(new Uint8Array(e.target.result)))
			}, (error, data) => {
				if (error) {
					alert(error.reason)
				} else {
					data.link = data.link.replace('http://', 'https://')
					templateInstance.recipes_picture.set(data.link);
					$('#loader').attr('src','signcheck.png');
					
				}
			})
			
		}
		rd.readAsArrayBuffer(file)


	},

	'click #add-new-ingredient ':(event)=>{
		event.preventDefault()
		$(".add-new-ingredient").append('<div class="one-ingredient"><div class="form-group"> <div class="col-md-2 col-md-offset-1 name-of-input">Količina</div><div class="col-md-8"><input name="kolicina" class="form-control"  type="text" placeholder="Unesite količinu" /> </div></div><div class="form-group"><div class="col-md-2 col-md-offset-1 name-of-input">Sastojak</div><div class="col-md-8"><input name="sastojak"  class="form-control"  type="text" placeholder="Unesite naziv sastojka" /></div></div></div>')
	},


	'click #ul-category li':function(event, templateInstance){
		let category = $(event.currentTarget).attr('name')
		templateInstance.category.set(category)
		$("#category").text($(event.currentTarget).attr('name'));
	},

	'click #ul-difficulty li':function(event, templateInstance){
		let difficulty = $(event.currentTarget).attr('name')
		templateInstance.difficulty.set(difficulty)
		$("#difficulty").text($(event.currentTarget).attr('name'));
	},

	'click #send-recipes':(event, templateInstance)=>{
		event.preventDefault()
		let name = $("#name").val()
		let time = $("#time").val()
		let category = templateInstance.category.get()
		let difficulty =templateInstance.difficulty.get()


		let number = $("#number").val()
		let wayoflife ="";
		if($('#wayoflife').is(':checked')){
			wayoflife="posno";
		}
		let picture =templateInstance.recipes_picture.get()		
		let ingredients = [];
		$('.one-ingredient').each((i,k) => {
			let a = {}
			$(k).find("input").each((i,k) => a[$(k).attr('name')] = $(k).val())
			ingredients.push(a)

			ingredients = ingredients.filter(i => i.sastojak)
		})

		let preparation =$("#preparation").val()
		let advice = $("#advice").val()
		//let filteradvice = advice.replace( new RegExp( "\n", "g" ),"<br>");

		if(picture==""){
			alert("Molim Vas sačekajte da se slika učita ili izaberite sliku koju želite da postavite")
		}else if(name=="" || time=="" || category=="" || difficulty==""   || preparation=="" || ingredients.length===0 ){

			alert("Molim Vas da unesete  sve potrebne informacije")
		}else{
				$('#theImg').hide();
			Meteor.call('addRecipes', name, time, category, difficulty, number, wayoflife, picture, ingredients, preparation, advice, (error, data)=>{
				$(document).scrollTop(0)
				if(!error){
					Router.go(`/recept/${data}`)     
				}
			})


		}

	}

})

Template.templateshowAdvanced.onCreated(function() {
	$(document).scrollTop(0)
	this.updatecommentid = new ReactiveVar("")
	this.deletecommentid = new ReactiveVar("")
	this.numberofcomments = new ReactiveVar("")
})


Template.templateshowAdvanced.events({
	'click #add-comment-button':(event, templateInstance)=>{
		event.preventDefault()
		let comment = $('#add-comment-input').val()
		let numberofcommentsvar= templateInstance.numberofcomments.get();
		let allowcommentagain = ()=>{
			templateInstance.numberofcomments.set("0")
			$("#add-comment-input").show();
			$("#add-comment-button").show();	
		}
		if(comment===""){
			alert("Polje u kome unosite komentar ne sme biti prazno !")
		}else{
			if(numberofcommentsvar<2){
				Meteor.call('addComment', comment, templateInstance.data._id)
				$('#add-comment-input').val("")
				numberofcommentsvar++
				templateInstance.numberofcomments.set(numberofcommentsvar)
			}else{
				alert("Mora proći 2 minute pre nego što će Vam opet biti omogućeno da dodate komentar")
				$("#add-comment-input").hide();
				$("#add-comment-button").hide();
				setTimeout(allowcommentagain, 2*60000);
			}
		}
	},

	'click .fa.fa-trash-o.delete-post':function(event, templateInstance){
		$('#post-delete-modal').toggle();
	},
	'click .fa.fa-pencil-square-o.update-post':function(event, templateInstance){
		Router.go('/izmenite_recept/')
	},
	
	'click .fa.fa-trash-o.delete-comment':function(event, templateInstance){
		$('#comment-delete-modal').toggle();
		templateInstance.deletecommentid.set(this._id);	


	},
	'click .fa.fa-pencil-square-o.update-comment':function(event, templateInstance){
		$('#comment-update-modal').toggle();
		templateInstance.updatecommentid.set(this._id);	
	},
	'click .close.delete-post-modal':()=>{
		$('#post-delete-modal').toggle();	
	},
	'click .close.delete-comment-modal':()=>{
		$('#comment-delete-modal').toggle();	
	},
	'click .close.update-comment-modal':()=>{
		$('#comment-update-modal').toggle();
	},

	'click .post-delete-commit':(event, templateInstance)=>{
		Meteor.call('deleteRecipes', templateInstance.data._id)
		Router.go('/')
	},
	'click .comment-delete-commit':function(event, templateInstance){
		event.preventDefault()
		let commentdeleteid = templateInstance.deletecommentid.get()
		Meteor.call('removeComment', commentdeleteid)
		$('#comment-delete-modal').toggle()
	},
	'click .comment-update-commit':function(event, templateInstance){
		event.preventDefault()
		let idofcomment = templateInstance.updatecommentid.get()
		let newcommmetnvalue =$('.commentinput').val()
		Meteor.call('updateComment', idofcomment, newcommmetnvalue)
		$('#comment-update-modal').toggle()
	},
	'click .fa.fa-thumbs-up':(events, templateInstance) => {
		let recipe = Recipes.findOne({_id:Template.instance().data._id})
		let id = Template.instance().data._id
		Meteor.call('like',id)
	},
})
