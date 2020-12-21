const expect = require("chai").expect;
const { MalformedFilterError } = require("../src/malformedFilters");
const simplify = require('../src/simplify');

describe("simplify - extra tests", function () {

  // Extra tests go here...
  it("'in' filter with duplicate elements of the same value should become is", function () {
    expect(simplify({
      type: 'in', attribute: 'place', values: ['Long Island', 'Long Island']
    })).to.deep.equal({
      type: 'is', attribute: 'place', value: 'Long Island'
    });
  });

  it("'in' filter with empty elements of the same value should become false", function () {
    expect(simplify({
      type: 'in', attribute: 'place', values: ['', '', '', '']
    })).to.deep.equal({
      type: 'false'
    });
  });

  it("'and' filter with multiple nested 'is' filters on the same attribute requesting differing values should become false", function () {
    expect(simplify({
      type: 'and', filters: [
        { type: 'is', attribute: 'device', value: 'iPhone' },
        { type: 'is', attribute: 'device', value: 'Android' }
      ]
    })).to.deep.equal({
      type: 'false'
    });
  });

  it("'and' filter with multiple nested 'is' filters on the same attribute requesting same values should become 'is'", function () {
    expect(simplify({
      type: 'and', filters: [
        { type: 'is', attribute: 'device', value: 'iPhone' },
        { type: 'is', attribute: 'device', value: 'iPhone' },
        { type: 'is', attribute: 'device', value: 'iPhone' }
      ]
    })).to.deep.equal({
      type: 'is',
      attribute: 'device',
      value: 'iPhone'
    });
  });

  it("Filter type not in 'and', 'false', 'is', 'in should throw error", function () {
    expect(function () {
      simplify({
        type: 'or', filters: [
          { type: 'is', attribute: 'device', value: 'iPhone' },
          { type: 'is', attribute: 'device', value: 'Android' }
        ]
      })
    }).to.throw(MalformedFilterError)
  });

  it("Multiple 'in' filters should combine to single 'in' if there's multiple overlap", function () {
    expect(simplify({
      type: 'and',
      filters: [
        { type: 'in', attribute: 'country', values: ['United States', 'Mexico', 'Canada', 'Ecuador'] },
        { type: 'in', attribute: 'country', values: ['Mexico', 'United Kingdom', 'Canada', 'Brazil'] }
      ]
    })).to.deep.equal({
      type: 'in', attribute: 'country', values: ['Mexico', 'Canada']
    });
  });

  it("Nested filters in 'and' must confirm to expected filters schema and throw error if not", function () {
    expect(function () {
      simplify({
        type: 'and', filters: [
          { type: 'is', attribute: 'device', value: 'iPhone' },
          { type: 'is', attribute: 'device', values: ['iPhone'] },
        ]
      })
    }).to.throw(MalformedFilterError)
  });

  it("Empty 'is' filter should evaluate to false", function () {
    expect(simplify({
      type: 'is',
      attribute: 'color',
      value: ''
    })).to.deep.equal({
      type: 'false'
    });
  });

  it("Nested empty 'is' filter should evaluate to false", function () {
    expect(simplify({
      type: 'and', filters: [
        { type: 'is', attribute: 'color', value: '' }
      ]
    })).to.deep.equal({
      type: 'and', filters: [
        { type: 'false' }
      ]
    });
  });
});
