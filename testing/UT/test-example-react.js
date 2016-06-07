import React from 'react';
import { mount, shallow } from 'enzyme';
import { expect } from 'chai';



class Foo extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
		  	<div className="foo" />
		);
	}
}

describe("A suite", function() {
	it("contains spec with an expectation", function() {
		expect(shallow(<Foo />).contains(<div className="foo" />)).to.equal(true);
	});

	it("contains spec with an expectation", function() {
		expect(shallow(<Foo />).is('.foo')).to.equal(true);
	});

	it("contains spec with an expectation", function() {
		expect(mount(<Foo />).find('.foo').length).to.equal(1);
	});
});