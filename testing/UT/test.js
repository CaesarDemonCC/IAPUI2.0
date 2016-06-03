
var expect = require('chai').expect;
//
function add(x, y) {
  return x + y;
}

describe('Test for add function', function() {
  it('1 + 1 should equal 2', function() {
    expect(add(1, 1)).to.be.equal(3);
  });
});

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
