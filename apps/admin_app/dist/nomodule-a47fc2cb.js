System.register(["./nomodule-0e20d20b.js","./nomodule-8ceccb0a.js"],(function(e,t){var o,i,s,a,n,r,p,d,u,l;return{setters:[function(e){o=e.createSuper,i=e.inherits,s=e.getPrototypeOf,a=e.get,n=e.createClass,r=e.classCallCheck},function(e){p=e._,d=e.e,u=e.Y}],execute:function(){e("Y",l=function(e){i(p,e);var t=o(p);function p(){var e;return r(this,p),(e=t.apply(this,arguments)).new=!0,e.method="POST",e}return n(p,[{key:"customRedirect",value:function(e){}},{key:"setupAfterOpen",value:function(e){}},{key:"customFormResponse",value:function(e){}},{key:"updated",value:function(e){a(s(p.prototype),"updated",this).call(this,e),e.has("new")&&this._setupNewUpdateState()}},{key:"connectedCallback",value:function(){a(s(p.prototype),"connectedCallback",this).call(this),this.addListener("yp-form-response",this._formResponse.bind(this))}},{key:"disconnectedCallback",value:function(){a(s(p.prototype),"disconnectedCallback",this).call(this),this.removeListener("yp-form-response",this._formResponse.bind(this))}},{key:"_logoImageUploaded",value:function(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedLogoImageId=t.id}},{key:"_headerImageUploaded",value:function(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedHeaderImageId=t.id}},{key:"_defaultDataImageUploaded",value:function(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedDefaultDataImageId=t.id}},{key:"_defaultPostImageUploaded",value:function(e){var t=JSON.parse(e.detail.xhr.response);this.uploadedDefaultPostImageId=t.id}},{key:"_formResponse",value:function(e){"function"==typeof this.customRedirect&&this.customRedirect(e.detail),"function"==typeof this.refreshFunction&&this.refreshFunction(e.detail),e&&e.detail&&e.detail.isError?console.log("Not clearing form because of user error"):this.clear(),this.customFormResponse(e)}},{key:"_setupNewUpdateState",value:function(){this.new?(this.saveText=this.t("create"),this.method="POST"):(this.saveText=this.t("update"),this.method="PUT"),this.setupTranslation()}},{key:"open",value:function(e,t){window.appUser&&!0===window.appUser.loggedIn()?(this.new=!!e,t&&(this.params=t),"function"==typeof this.setupAfterOpen&&this.setupAfterOpen(t),this.$$("#editDialog").open()):window.appUser.loginForEdit(this,e,t,this.refreshFunction)}},{key:"close",value:function(){this.$$("#editDialog").close()}}]),p}(u)),p([d({type:Boolean})],l.prototype,"new",void 0),p([d({type:String})],l.prototype,"editHeaderText",void 0),p([d({type:String})],l.prototype,"saveText",void 0),p([d({type:String})],l.prototype,"snackbarText",void 0),p([d({type:Object})],l.prototype,"params",void 0),p([d({type:String})],l.prototype,"method",void 0),p([d({type:Object})],l.prototype,"refreshFunction",void 0)}}}));
