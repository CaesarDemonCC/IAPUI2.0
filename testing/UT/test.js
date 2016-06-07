import { expect } from 'chai';

describe('Testing', function() {
  it('Testing', function() {
    // equal
	expect(4 + 5).to.be.equal(9);
	expect(4 + 5).to.be.not.equal(10);

	// boolean
	expect('everthing').to.be.ok;
	expect(false).to.not.be.ok;

	// typeof
	expect('test').to.be.a('string');

	// include
	expect([1,2,3]).to.include(2);
	expect('foobar').to.contain('foo');

	// empty
	expect([]).to.be.empty;
	expect('').to.be.empty;
	expect({}).to.be.empty;

	// match
	expect('foobar').to.match(/^foo/);
  });
});
