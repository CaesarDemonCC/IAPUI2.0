import {PanelContent} from './panel'

const Dialog = React.createClass({
    onSubmit (e) {
      this.props.onSubmit(e);
    },
    onCancel(e) {
      this.props.onCancel(e);
    },
    getDialogEl() {
        var header,footer;
        if (this.props.title) {
            header = (
              <div>
                <div style={{ textAlign:'left'}}>{this.props.title}</div>
                <div className='divider_horiz'></div>
              </div>
            );
        }
        
        footer = (
          <div>
            <div className='divider_horiz'></div>
            <button className='button medium columns large-2' onClick={this.onSubmit}>OK</button>
            <button className='button secondary medium columns large-2' onClick={this.onCancel}>Cancel</button>
          </div>
        );
        
        
        return (
          <div>
              {header}
              <PanelContent items={this.props.items} ref='panelContent'/>
              {footer}
          </div>
        );
    },

    render() {
      var close;
      if(this.props.close) {
          close = (
              <div>
                  <a className="icosolo icon_close" onClick={this.onCancel}></a>
              </div>);
      }
        return (
          <div className='overlay light open'>
              {close}
              <div className='message'>
                  {this.getDialogEl()}
              </div>
          </div>
        );
    },
});

module.exports = {
  Dialog : Dialog
}