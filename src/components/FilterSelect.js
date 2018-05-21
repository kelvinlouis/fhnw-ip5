import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = {
  formControl: {
    'width': '100%',
    'margin-bottom': '1em',
  },
};

class FilterSelect extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    value: '',
  };

  changeValue = event => {
    const { onChange } = this.props;
    const newValue = event.target.value;
    onChange(newValue);
  };

  render() {
    const { classes, id, label, list, value } = this.props;

    // Ensure options consist of value and label
    const options = list.map(v => {
      if (v.label && v.value) {
        return v;
      } else {
        return {
          label: v,
          value: v,
        };
      }
    });

    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
          value={value}
          onChange={this.changeValue}
          inputProps={{
            name: id,
            id: id,
          }}
        >
          <MenuItem value="">-</MenuItem>
          {options.map(option => (
            <MenuItem
              key={option.value}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles)(FilterSelect);
