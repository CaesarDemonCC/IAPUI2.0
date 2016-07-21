import {buttonMixin} from '../../utils/mixin'
import {Dialog} from './dialog'

var LoadingDialog = React.createClass({
    mixins: [buttonMixin],
    getInitialState() {
        return {
            loading: true
        };
    },
    getItems () {
        let loading = '';
        let content = '';
        if (this.state.loading) {
            loading = (<div><p className="network-init-loading">
                        <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                        <span className="sr-only">Loading...</span>
                        </p>
                        <p>{this.props.loadingTitle}</p>
                        </div>);
        }
        if (!this.state.loading) {
            content = (<div>
                    <p className="network-init-message">{this.props.message}</p>
                    <div className="controls">
                        <button className="medium button medium-6" onClick={this.submitHandler}>OK</button>
                    </div>
                    </div>);
        }
        return [{
                type: 'template',
                template:(<div className="network-init-success-content">
                    {loading}
                    {content}
                </div>)
            }];
    },
    componentDidMount() {
        let self = this;
        if (this.props.hide) {
            setTimeout(function() {
                self.setState({loading: false})
            }, 3000);
        }
    },
    render () {
        var items = this.getItems();
        
        return (<div>
                <Dialog className='message confirmation'
                items={items}
                footer={<div/>}
                />
            </div>)
    }
});

module.exports = {
    LoadingDialog : LoadingDialog
};