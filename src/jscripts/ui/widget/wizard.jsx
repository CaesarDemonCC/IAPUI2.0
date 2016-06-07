import {PanelContent} from './panel'

var WizardControls = React.createClass({
    goToStep : function (index) {
        this.props.clickHandler.call(this, index);
    },
    render: function () {
        var self = this;

        var wizardCtrls = this.props.wizardCtrls.map(function (WizardCtrl, index) {
            var props = {
                key: index,
                className: index == self.props.currentStep ? 'current' : '',
                title: WizardCtrl.title,
                onClick: self.goToStep.bind(self, index)
            }

            return <li {...props}><a>{WizardCtrl.title}</a></li>;
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
            lastStep: this.props.wizardsConfig.length - 1 || 0
        }
    },

    goToStep: function (index) {
        console.log('goToStep ' + index);
        this.setState({currentStep: index});
    },

    goBack: function () {
        this.goToStep(this.state.currentStep - 1);
    },

    goNext: function () {
        this.goToStep(this.state.currentStep + 1);
    },

    onSubmit: function () {
        console.log('Finished!')
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

        content = <PanelContent key={this.state.currentStep} items={wizardsConfig[this.state.currentStep].items} handler={wizardsConfig[this.state.currentStep].handler}/>;

        var buttonProps = {
            currentStep: this.state.currentStep,
            lastStep: this.state.lastStep,
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
                <WizardControls wizardCtrls={wizardCtrls} clickHandler={this.goToStep} currentStep={this.state.currentStep}/>
                <div className='wizard-content'>
                    {content}
                </div>
                <WizardButtons {...buttonProps} />
            </div>
        )
    }
});

module.exports = {
    Wizard: Wizard
}