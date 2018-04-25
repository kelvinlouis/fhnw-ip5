import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './FilterControls.css';

class FilterControls extends Component {
  static propTypes = {
    onFilterChange: PropTypes.fn,
  };

  static defaultProps = {
    onFilterChange: () => {},
  };

  componentDidMount() {
    const {onFilterChange} = this.props;

    setTimeout(() => onFilterChange(1), 1000);
  }

  render() {
    return (
      <div className="FilterControls">
        FilterControls
      </div>
    );
  }
}

export default FilterControls;
