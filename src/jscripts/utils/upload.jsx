import {getUser} from './auth'

var Upload = React.createClass({
		
  	componentDidMount() {
    	this.initIframe();
  	},
	onLoad() {
	    const props = this.props;
	    let response;
	    const eventFile = this.file;
	    try {
	      const doc = this.getIframeDocument();
	      const script = doc.getElementsByTagName('script')[0];
	      if (script && script.parentNode === doc.body) {
	        doc.body.removeChild(script);
	      }
	      //response = doc.body.innerHTML;
	      //props.onSuccess(response, eventFile);
	    } catch (err) {
	      //warning(false, 'cross domain error for Upload. Maybe server should return document.domain script. see Note from https://github.com/react-component/upload');
	      response = 'cross-domain';
	      props.onError(err, null, eventFile);
	    }
	    this.initIframe();
	},
	onChange() {
	    const target = this.getFormInputNode();
	    // ie8/9 don't support FileList Object
	    // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
	    const file = this.file = {
	      upload_id: this.getUID(),
	      sid: getUser().sid,
	    };
	    //this.props.onStart(this.getFileForMultiple(file));
	    const formNode = this.getFormNode();
	    const dataSpan = this.getFormDataNode();
	    let data = this.props.data;
	    // if (typeof data === 'function') {
	    //   data = data(file);
	    // }
	    $.extend(data, file);
	    const inputs = [];
	    for (const key in data) {
	      if (data.hasOwnProperty(key)) {
	        inputs.push(`<input name="${key}" value="${data[key]}"/>`);
	      }
	    }
	    dataSpan.innerHTML = inputs.join('');
	    formNode.submit();
	    dataSpan.innerHTML = '';
	    //this.disabledIframe();
	},
	getIframeNode() {
	    return this.refs.iframe;
	},
	getIframeDocument() {
	    return this.getIframeNode().contentDocument;
	},
	getFormNode() {
	    return this.getIframeDocument().getElementById('form');
	},
	getFormInputNode() {
	    return this.getIframeDocument().getElementById('input');
	},
	getFormDataNode() {
	    return this.getIframeDocument().getElementById('data');
	},
	getIframeHTML() {
	    return `
	    <!DOCTYPE html>
	    <html>
	    <head>
	    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
	    <style>
	    body,html {padding:0;margin:0;border:0;overflow:hidden;}
	    </style>
	    </head>
	    <body>
	    <form method="post"
	    encType="multipart/form-data"
	    action="${this.props.action}" id="form" style="display:block;width:245px;height:30px;position:relative;overflow:hidden;">
	    <input id="input" type="file"
	     name="${this.props.name}"
	     style="position:absolute;top:0;right:0;width:245px;height:30px;cursor:pointer;"/>
	    <span id="data"></span>
	    </form>
	    </body>
	    </html>
	    `;
	},
	initIframe() {
	    const iframeNode = this.getIframeNode();
	    let win = iframeNode.contentWindow;
	    let doc;
	    try {
	      doc = win.document;
	    } catch (e) {
	      win = iframeNode.contentWindow;
	      doc = win.document;
	    }
	    if (doc.documentElement.tagName === 'HTML') {
		    doc.open('text/html', 'replace');
		    doc.write(this.getIframeHTML());
		    doc.close();
	    	this.getFormInputNode().onchange = this.onChange;
	    }
	},
	render() {
	    return (
	      <span
	        style={{position: 'relative', zIndex: 0}}
	      >
	        <iframe
	          ref="iframe"
		      onLoad={this.onLoad}
	          style={iframeStyle}
	        />
	        {this.props.children}
	      </span>
	    );
	},
	getUID() {
	    var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	        return v.toString(16);
	    }).toUpperCase();
	    
	    return uid;
	}
	
});
const iframeStyle = {
		  position: 'absolute',
		  top: 0,
		  opacity: 0,
		  filter: 'alpha(opacity=0)',
		  left: 0,
		  zIndex: 9999,
	};

module.exports = {
	Upload : Upload
}