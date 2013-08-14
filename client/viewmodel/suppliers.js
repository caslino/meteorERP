Session.set('editting_supplier', false);
Session.set('sid', null);

Template.suppliers.suppliers = function(){
	return suppliers.find( {}, {sort: {dateadded: -1} } );
};

Template.suppliers.events({
	'click .btnRemoveSupplier': function (e,t){
		// console.log( e.target.id );
		Meteor.flush();
		suppliers.remove({_id: e.target.id });
		
	},
	'click .btnEditSupplier': function (e,t){
		Session.set('editting_supplier', true);
		Session.set('sid', this._id);

		Meteor.flush();	
		$("form#form_addSupplier").show();
		
	}
});

Template.supplier_form.editting_supplier = function(){
	return Session.equals('editting_supplier', true);
};

Template.supplier_form.info = function(){
	if(Session.equals('sid', null)){
		return null;
	}
	else{
		var sid = Session.get('sid')
		var info = suppliers.find( { _id: sid} );
		if(info){
			return info;
		}
		return info["name"] = "none selected";
	}

};

Template.supplier_form.events({
	'submit': function (e,t){
		form = {};

		$.each( $("#form_addSupplier").serializeArray(),function(){
			form[this.name] = this.value;
		});
			
		form['dateadded'] = Date("yyyy-MM-DD HH:mm");

		suppliers.insert( form, function(err){
			if(err){
				if(err.error === 403){
					alert("Only admins can create new suppliers.")
				}else{
					alert("Something went wrong. Please try again.");
					console.log(err);
				}
				
			}
			else{
				$('#form_addSupplier')[0].reset();
			}
		});

		e.preventDefault();
	},
	'click #btnCancel': function(e,t){
		Session.set('editting_supplier', false);
		Session.set('sid', null);

		
		$("form#form_addSupplier").hide();
		$('#form_addSupplier')[0].reset();
		// Meteor.flush();	
	},
	'click #btnUpdateSupplier': function (e,t){
		form = {};

		$.each( $("#form_addSupplier").serializeArray(),function(){
			form[this.name] = this.value;
		});

		suppliers.update({_id: form['id']}, {$set: {name: form['name'], company: form['company'], description: form['description'] } });
	}
});