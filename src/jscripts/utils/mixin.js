var Mixins = {
	buttonMixin : {
		submitHandler : function (e) {
			this.props.onSubmit(e);
		},
		cancelHandler : function (e) {
			this.props.onCancel(e);
		}
	}
} 

module.exports = Mixins;