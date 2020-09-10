import React, { Component} from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

class datePicker extends Component {
  constructor(){
    super();
    this.state = {
      startDate: new Date(),
    };
  }
  render() {
  

    const handleChange = (date) => {
      this.setState({
        startDate: date,
      });
    };
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange}
      />
    );
  }
}
export default datePicker;
