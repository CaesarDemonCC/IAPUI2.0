import {PanelContent} from './panel'
import {Ajax} from '../../utils/ajax'

var WizardControls = React.createClass({
    goToStep : function (index) {
        this.props.clickHandler.call(this, index);
    },
    render: function () {
        var self = this;

        var wizardCtrls = this.props.wizardCtrls.map(function (WizardCtrl, index) {
            var className = '';

            //if (index <= self.props.activeStep) {
            if (index <= self.props.currentStep) {
                className += 'active '
            }

            if (index == self.props.currentStep) {
                className += 'current ';
            }

            var props = {
                key: index,
                onClick: self.goToStep.bind(self, index),
                className: className
            }

            return <li {...props}><span className='badge'>{index + 1}</span><span className='wizard-control-title'>{WizardCtrl.title}</span></li>;
        })
        return (
            <ul className='wizard-controls'>
                {wizardCtrls}
            </ul>
        )
    }
})

var WizardButtons = React.createClass({
    render: function () {

        var currentStep = this.props.currentStep,
            lastStep = this.props.lastStep;

        var backButton = null,
            nextButton = null,
            cancelButton = null;

        var self = this;

        // The first page doesn't have back button
        if (currentStep !== 0) {
            backButton = <button className='button white-button' key='back' onClick={this.props.goBack}>Back</button>
        }

        // Display finish button instead of next button for the last step
        if (currentStep === lastStep) {
            nextButton = <button className='button' key='finish' onClick={this.props.onSubmit}>Finish</button>
        } else {
            nextButton = <button className='button' key='next' onClick={this.props.goNext}>Next</button>
        }

        cancelButton = <button className='button white-button' key='cancel' onClick={this.props.onCancel}>Cancel</button>

        return (
            <div className='wizard-footer'>
                {nextButton}
                {backButton}
                {cancelButton}
            </div>
        )
    }
})

var Wizard = React.createClass({

    getInitialState: function () {
        return {
            currentStep: 0,
            activeStep: 0,
            lastStep: this.props.wizardsConfig.length - 1 || 0
        }
    },

    componentDidMount: function() {
        var cmdList= [];
        this.props.wizardsConfig.forEach((prop) => {
            if ($.isArray(prop.showCmd)) {
                prop.showCmd.forEach((cmd)=>{
                    cmdList.push(cmd);
                });
            } else {
                cmdList.push(prop.showCmd);
            }
        });
        Ajax.get({
            'opcode':'show',
            'cmd': cmdList
        }, function(data){
            if (this.props.parseData) {
                this.props.parseData(data);
            }
        }.bind(this));
    },

    goToStep: function (index) {
        var currentStepData = this.refs.panelContent.getData();
        this.props.wizardsData[this.state.currentStep] = currentStepData;
        this.setState({
            currentStep: index,
            activeStep: this.state.activeStep < index? index: this.state.activeStep
        });
    },

    goBack: function () {
        this.goToStep(this.state.currentStep - 1);
    },

    goNext: function () {
        this.goToStep(this.state.currentStep + 1);
    },

    onSubmit: function () {
        this.props.onSubmit();
    },

    onCancel: function () {
        console.log('Cancel!');
    },

    render: function () {
        var wizardCtrls = [],
            content = null,
            handlers = [];

        var wizardsConfig = this.props.wizardsConfig;
        wizardsConfig.forEach(function (Wizard) {
            wizardCtrls.push({title: Wizard.title});
            handlers.push(Wizard.handler || function () {})
        })

        content = <PanelContent ref='panelContent' key={this.state.currentStep} tabData={this.props.wizardsData[this.state.currentStep]} items={wizardsConfig[this.state.currentStep].items} handler={wizardsConfig[this.state.currentStep].handler}/>;

        var wcProps = {
            ...this.state,
            wizardCtrls: wizardCtrls,
            clickHandler: this.goToStep
        }

        var buttonProps = {
            ...this.state,
            goBack: this.goBack,
            goNext: this.goNext,
            onSubmit: this.onSubmit,
            onCancel: this.onCancel
        }

        return (
            <div className='wizard'>
                <div className='wizard-header'>
                    <h3 className="wizard-title">{this.props.title}</h3>
                </div>
                <WizardControls {...wcProps} />
                <div className='wizard-content'>
                    {content}
                    <WizardButtons {...buttonProps} />
                </div>
            </div>
        )
    }
});

module.exports = {
    Wizard: Wizard
}